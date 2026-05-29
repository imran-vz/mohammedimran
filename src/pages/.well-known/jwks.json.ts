import type { APIRoute } from 'astro';
import { jsonResponse } from '../../config/agent-discovery';

export const GET: APIRoute = () =>
	jsonResponse({
		keys: [],
	});
