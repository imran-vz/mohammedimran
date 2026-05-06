import type { APIRoute } from 'astro';
import { cacheEnv } from '../../config/cache-env';
import { CACHE_KEYS, type CacheKeyName, getCacheKeyNames, kv } from '../../lib/cache';

const headers = new Headers([['Content-Type', 'application/json']]);

function isCacheKeyName(keyName: string): keyName is CacheKeyName {
	return keyName in CACHE_KEYS;
}

function jsonResponse(body: object, status: number): Response {
	return new Response(JSON.stringify(body), { status, headers });
}

async function cacheInvalidationPayload(request: Request): Promise<{ secret: string | null; requestedKey: string | null }> {
	const contentType = request.headers.get('content-type');
	if (!contentType?.includes('application/json')) {
		const url = new URL(request.url);
		return {
			secret: url.searchParams.get('secret'),
			requestedKey: url.searchParams.get('key'),
		};
	}

	const body = await request.json();
	return {
		secret: body.secret,
		requestedKey: body.key ?? null,
	};
}

function keyNamesFromRequest(requestedKey: string | null): string[] {
	return requestedKey ? [requestedKey] : getCacheKeyNames();
}

function errorMessageFrom(error: unknown): string {
	return error instanceof Error ? error.message : 'Unknown error';
}

function configurationErrorResponse(expectedSecret: string | undefined): Response | null {
	return expectedSecret ? null : jsonResponse({ error: 'Cache invalidation not configured' }, 500);
}

function authorizationErrorResponse(secret: string | null, expectedSecret: string): Response | null {
	return secret === expectedSecret ? null : jsonResponse({ error: 'Unauthorized' }, 401);
}

function invalidKeyResponse(keyNames: string[]): Response | null {
	const invalidKeys = keyNames.filter((keyName) => !isCacheKeyName(keyName));
	return invalidKeys.length > 0 ? jsonResponse({ error: 'Unknown cache key', keys: invalidKeys }, 400) : null;
}

async function deleteCacheKeys(keyNames: string[]): Promise<string[]> {
	const validKeyNames = keyNames.filter(isCacheKeyName);
	const deletedKeys = validKeyNames.map((keyName) => CACHE_KEYS[keyName].key);
	await kv.del(...deletedKeys);
	return deletedKeys;
}

async function invalidateCache(request: Request): Promise<Response> {
	const expectedSecret = cacheEnv.invalidationSecret;
	const configurationError = configurationErrorResponse(expectedSecret);
	if (configurationError) return configurationError;

	const { secret, requestedKey } = await cacheInvalidationPayload(request);
	const authorizationError = authorizationErrorResponse(secret, expectedSecret);
	if (authorizationError) return authorizationError;

	const keyNames = keyNamesFromRequest(requestedKey);
	const keyError = invalidKeyResponse(keyNames);
	if (keyError) return keyError;

	const deletedKeys = await deleteCacheKeys(keyNames);

	return jsonResponse({ success: true, message: 'Cache invalidated successfully', keys: deletedKeys }, 200);
}

async function safeInvalidateCache(request: Request): Promise<Response> {
	try {
		return await invalidateCache(request);
	} catch (error) {
		console.error('Error invalidating cache:', error);
		return jsonResponse({ error: 'Failed to invalidate cache', message: errorMessageFrom(error) }, 500);
	}
}

export const POST: APIRoute = async ({ request }) => safeInvalidateCache(request);
export const GET: APIRoute = async ({ request }) => safeInvalidateCache(request);
