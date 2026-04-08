import { createClient } from '@vercel/kv';
import axios from 'axios';
import { env } from '../config/env';

const kv = createClient({
	url: env.kvRestApiUrl,
	token: env.kvRestApiToken,
});

export { kv };

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

	if (axios.isAxiosError(error)) {
		console.error(error.response?.data || error);
		return new Response(JSON.stringify({ message: error.response?.data || error.message }), {
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
