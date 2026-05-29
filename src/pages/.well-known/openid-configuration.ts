import type { APIRoute } from 'astro';
import { jsonResponse } from '../../config/agent-discovery';
import { oauthAuthorizationServerMetadata } from '../../config/oauth-metadata';

export const GET: APIRoute = () =>
	jsonResponse({
		...oauthAuthorizationServerMetadata,
		subject_types_supported: ['public'],
		id_token_signing_alg_values_supported: ['RS256'],
		claims_supported: ['sub'],
	});
