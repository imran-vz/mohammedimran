import type { APIRoute } from 'astro';
import { env } from '../../config/env';
import { CACHE_KEYS, type CacheKeyName, getCacheKeyNames, kv } from '../../lib/cache';

const headers = new Headers([['Content-Type', 'application/json']]);

function isCacheKeyName(keyName: string): keyName is CacheKeyName {
	return keyName in CACHE_KEYS;
}

async function invalidateCache(request: Request): Promise<Response> {
	try {
		const expectedSecret = env.cacheInvalidationSecret;
		if (!expectedSecret) {
			return new Response(JSON.stringify({ error: 'Cache invalidation not configured' }), { status: 500, headers });
		}

		// Extract secret from body or query params
		let secret: string | null = null;
		let requestedKey: string | null = null;
		const contentType = request.headers.get('content-type');

		if (contentType?.includes('application/json')) {
			const body = await request.json();
			secret = body.secret;
			requestedKey = body.key ?? null;
		} else {
			const url = new URL(request.url);
			secret = url.searchParams.get('secret');
			requestedKey = url.searchParams.get('key');
		}

		if (!secret || secret !== expectedSecret) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
		}

		const keyNames = requestedKey ? [requestedKey] : getCacheKeyNames();
		const invalidKeys = keyNames.filter((keyName) => !isCacheKeyName(keyName));

		if (invalidKeys.length > 0) {
			return new Response(JSON.stringify({ error: 'Unknown cache key', keys: invalidKeys }), { status: 400, headers });
		}

		const validKeyNames = keyNames.filter(isCacheKeyName);
		const deletedKeys = validKeyNames.map((keyName) => CACHE_KEYS[keyName].key);
		await kv.del(...deletedKeys);

		return new Response(
			JSON.stringify({ success: true, message: 'Cache invalidated successfully', keys: deletedKeys }),
			{ status: 200, headers },
		);
	} catch (error) {
		console.error('Error invalidating cache:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return new Response(JSON.stringify({ error: 'Failed to invalidate cache', message }), { status: 500, headers });
	}
}

export const POST: APIRoute = async ({ request }) => invalidateCache(request);
export const GET: APIRoute = async ({ request }) => invalidateCache(request);
