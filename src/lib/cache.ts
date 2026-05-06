import { createClient } from '@vercel/kv';
import { env } from '../config/env';
import CustomError from '../utils/CustomError';

const kv = createClient({
	url: env.kvRestApiUrl,
	token: env.kvRestApiToken,
});

export { kv };

const SIX_HOURS = 60 * 60 * 6;
const SEVEN_DAYS = 60 * 60 * 24 * 7;

export const CACHE_KEYS = {
	githubProjects: {
		key: 'github-projects',
		ttlSeconds: SEVEN_DAYS,
	},
	githubProjectsParsed: {
		key: 'github-projects-parsed',
		ttlSeconds: SEVEN_DAYS,
		dependsOn: ['githubProjects'],
	},
	featuredProjects: {
		key: 'featured-projects',
		ttlSeconds: SIX_HOURS,
	},
} as const;

export type CacheKeyName = keyof typeof CACHE_KEYS;

export function getCacheKeyNames(): CacheKeyName[] {
	return Object.keys(CACHE_KEYS) as CacheKeyName[];
}

/**
 * Check cache first, fetch on miss, store result with TTL.
 */
export async function cachedFetch<T>(key: string, fetcher: () => Promise<T>, ttlSeconds: number): Promise<T> {
	const cached = await kv.get<T>(key);
	if (cached) return cached;

	const data = await fetcher();
	await kv.set(key, data, { ex: ttlSeconds });
	return data;
}

/**
 * Same as cachedFetch but uses hash fields (hget/hset).
 * Note: hset does not support atomic TTL, so expire is called separately.
 */
export async function cachedHashFetch<T>(
	key: string,
	field: string,
	fetcher: () => Promise<T>,
	ttlSeconds: number,
): Promise<T> {
	const cached = await kv.hget<T>(key, field);
	if (cached) return cached;

	const data = await fetcher();
	await kv.hset(key, { [field]: data });
	await kv.expire(key, ttlSeconds);
	return data;
}

/**
 * Unified API error handler returning a proper Response.
 */
export function handleApiError(error: unknown): Response {
	const headers = { 'Content-Type': 'application/json' };

	if (error instanceof CustomError) {
		console.error(error);
		return new Response(JSON.stringify({ message: error.message, type: error.type }), {
			status: 500,
			headers,
		});
	}

	console.error(error);

	if (error instanceof Error) {
		return new Response(JSON.stringify({ message: error.message }), {
			status: 500,
			headers,
		});
	}

	return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
		status: 500,
		headers,
	});
}
