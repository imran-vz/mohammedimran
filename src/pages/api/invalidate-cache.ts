import type { APIRoute } from 'astro';
import { env } from '../../config/env';
import { kv } from '../../lib/cache';

const headers = new Headers([['Content-Type', 'application/json']]);

async function invalidateCache(request: Request): Promise<Response> {
	try {
		const expectedSecret = env.cacheInvalidationSecret;
		if (!expectedSecret) {
			return new Response(
				JSON.stringify({ error: 'Cache invalidation not configured' }),
				{ status: 500, headers },
			);
		}

		// Extract secret from body or query params
		let secret: string | null = null;
		const contentType = request.headers.get('content-type');

		if (contentType?.includes('application/json')) {
			const body = await request.json();
			secret = body.secret;
		} else {
			const url = new URL(request.url);
			secret = url.searchParams.get('secret');
		}

		if (!secret || secret !== expectedSecret) {
			return new Response(
				JSON.stringify({ error: 'Unauthorized' }),
				{ status: 401, headers },
			);
		}

		await kv.del('featured-projects');

		return new Response(
			JSON.stringify({ success: true, message: 'Cache invalidated successfully' }),
			{ status: 200, headers },
		);
	} catch (error) {
		console.error('Error invalidating cache:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return new Response(
			JSON.stringify({ error: 'Failed to invalidate cache', message }),
			{ status: 500, headers },
		);
	}
}

export const POST: APIRoute = async ({ request }) => invalidateCache(request);
export const GET: APIRoute = async ({ request }) => invalidateCache(request);
