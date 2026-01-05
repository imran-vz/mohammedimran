import { createClient } from '@vercel/kv';
import type { APIRoute } from 'astro';
import { AxiosError } from 'axios';
import type { FeaturedProject } from '../../utils/fetch-featured-projects';
import { getFeaturedProjects } from '../../utils/fetch-featured-projects';

const kv = createClient({
	url: import.meta.env.KV_REST_API_URL,
	token: import.meta.env.KV_REST_API_TOKEN,
});

const headers = new Headers([['Content-Type', 'application/json']]);

export const GET: APIRoute = async () => {
	try {
		const featuredProjects = await getCachedFeaturedProjects();
		return new Response(JSON.stringify(featuredProjects), { headers });
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log(error?.response?.data || error);
			return new Response(JSON.stringify({ message: error.response?.data || error.message }), {
				status: 500,
				headers,
			});
		}

		console.log(error);

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
};

async function getCachedFeaturedProjects(): Promise<FeaturedProject[]> {
	let featuredProjects: FeaturedProject[] | null = null;

	// Try to get from cache
	const cacheResponse = await kv.get<FeaturedProject[]>('featured-projects');

	if (!cacheResponse) {
		// Cache miss - fetch fresh data
		featuredProjects = await getFeaturedProjects();

		// Store in cache with 6-hour expiration
		await kv.set('featured-projects', featuredProjects);
		await kv.expire('featured-projects', 60 * 60 * 6); // 6 hours
	} else {
		featuredProjects = cacheResponse;
	}

	return featuredProjects || [];
}
