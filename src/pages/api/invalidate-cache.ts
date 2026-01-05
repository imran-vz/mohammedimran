import { createClient } from '@vercel/kv';
import type { APIRoute } from 'astro';

const kv = createClient({
	url: import.meta.env.KV_REST_API_URL,
	token: import.meta.env.KV_REST_API_TOKEN,
});

const headers = new Headers([['Content-Type', 'application/json']]);

export const POST: APIRoute = async ({ request }) => {
	try {
		// Get secret from request body or query params
		const contentType = request.headers.get('content-type');
		let secret: string | null = null;

		if (contentType?.includes('application/json')) {
			const body = await request.json();
			secret = body.secret;
		} else {
			const url = new URL(request.url);
			secret = url.searchParams.get('secret');
		}

		// Validate secret
		const expectedSecret = import.meta.env.CACHE_INVALIDATION_SECRET;
		if (!expectedSecret) {
			return new Response(
				JSON.stringify({ error: 'Cache invalidation not configured' }),
				{ status: 500, headers },
			);
		}

		if (!secret || secret !== expectedSecret) {
			return new Response(
				JSON.stringify({ error: 'Unauthorized' }),
				{ status: 401, headers },
			);
		}

		// Invalidate cache
		await kv.del('featured-projects');

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Cache invalidated successfully'
			}),
			{ status: 200, headers },
		);
	} catch (error) {
		console.error('Error invalidating cache:', error);

		if (error instanceof Error) {
			return new Response(
				JSON.stringify({ error: 'Failed to invalidate cache', message: error.message }),
				{ status: 500, headers },
			);
		}

		return new Response(
			JSON.stringify({ error: 'Failed to invalidate cache' }),
			{ status: 500, headers },
		);
	}
};

export const GET: APIRoute = async ({ request }) => {
	try {
		const url = new URL(request.url);
		const secret = url.searchParams.get('secret');

		// Validate secret
		const expectedSecret = import.meta.env.CACHE_INVALIDATION_SECRET;
		if (!expectedSecret) {
			return new Response(
				JSON.stringify({ error: 'Cache invalidation not configured' }),
				{ status: 500, headers },
			);
		}

		if (!secret || secret !== expectedSecret) {
			return new Response(
				JSON.stringify({ error: 'Unauthorized' }),
				{ status: 401, headers },
			);
		}

		// Invalidate cache
		await kv.del('featured-projects');

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Cache invalidated successfully'
			}),
			{ status: 200, headers },
		);
	} catch (error) {
		console.error('Error invalidating cache:', error);

		if (error instanceof Error) {
			return new Response(
				JSON.stringify({ error: 'Failed to invalidate cache', message: error.message }),
				{ status: 500, headers },
			);
		}

		return new Response(
			JSON.stringify({ error: 'Failed to invalidate cache' }),
			{ status: 500, headers },
		);
	}
};
