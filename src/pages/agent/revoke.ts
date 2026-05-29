import type { APIRoute } from 'astro';
import { jsonResponse } from '../../config/agent-discovery';

export const GET: APIRoute = () =>
	jsonResponse({
		status: 'ok',
		events_supported: ['credential.revoked'],
	});

export const POST: APIRoute = () =>
	jsonResponse({
		status: 'revoked',
		note: 'Public read-only discovery credentials carry no private access on this site.',
	});
