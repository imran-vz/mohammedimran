import type { APIRoute } from 'astro';
import { discoveryApi, jsonResponse } from '../../config/agent-discovery';

export const GET: APIRoute = () =>
	jsonResponse({
		status: 'ok',
		token_endpoint: true,
		grant_types_supported: ['client_credentials'],
		scopes_supported: [discoveryApi.scope],
	});

export const POST: APIRoute = async () =>
	jsonResponse({
		access_token: 'public-read-only-discovery-token',
		token_type: 'Bearer',
		expires_in: 3600,
		scope: discoveryApi.scope,
		note: 'This token grants no private access; public discovery endpoints are available without authentication.',
	});
