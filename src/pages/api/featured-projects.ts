import type { APIRoute } from 'astro';
import { CACHE_KEYS, cachedFetch, handleApiError } from '../../lib/cache';
import type { FeaturedProject } from '../../utils/fetch-featured-projects';
import { getFeaturedProjects } from '../../utils/fetch-featured-projects';

const headers = new Headers([['Content-Type', 'application/json']]);

export const GET: APIRoute = async () => {
	try {
		const featuredProjects = await cachedFetch<FeaturedProject[]>(
			CACHE_KEYS.featuredProjects.key,
			getFeaturedProjects,
			CACHE_KEYS.featuredProjects.ttlSeconds,
		);
		return new Response(JSON.stringify(featuredProjects), { headers });
	} catch (error) {
		return handleApiError(error);
	}
};
