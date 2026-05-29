import type { APIRoute } from 'astro';
import { discoveryApi, jsonResponse } from '../../config/agent-discovery';

export const GET: APIRoute = () =>
	jsonResponse({
		status: 'ok',
		identity_type: 'anonymous',
		credential_types_supported: ['access_token'],
		scopes_supported: [discoveryApi.scope],
	});

export const POST = GET;
