import type { APIRoute } from 'astro';
import { cachedFetch, handleApiError } from '../../lib/cache';
import type { FeaturedProject } from '../../utils/fetch-featured-projects';
import { getFeaturedProjects } from '../../utils/fetch-featured-projects';

const SIX_HOURS = 60 * 60 * 6;
const headers = new Headers([['Content-Type', 'application/json']]);

export const GET: APIRoute = async () => {
	try {
		const featuredProjects = await cachedFetch<FeaturedProject[]>(
			'featured-projects',
			getFeaturedProjects,
			SIX_HOURS,
		);
		return new Response(JSON.stringify(featuredProjects), { headers });
	} catch (error) {
		return handleApiError(error);
	}
};
