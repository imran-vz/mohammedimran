import type { APIRoute } from 'astro';
import { discoveryApi, jsonResponse } from '../../config/agent-discovery';
import { oauthAuthorizationServerMetadata } from '../../config/oauth-metadata';

const registrationMetadata = {
	service: 'Imran.codes agent registration',
	description:
		'Public read-only discovery resources are available without registration. This endpoint advertises the registration shape for future protected agent access.',
	register_uri: oauthAuthorizationServerMetadata.agent_auth.register_uri,
	identity_types_supported: oauthAuthorizationServerMetadata.agent_auth.identity_types_supported,
	credential_types_supported: oauthAuthorizationServerMetadata.agent_auth.credential_types_supported,
	scopes_supported: [discoveryApi.scope],
};

export const GET: APIRoute = () => jsonResponse(registrationMetadata);

export const POST: APIRoute = async () =>
	jsonResponse({
		...registrationMetadata,
		status: 'accepted',
		credential_type: 'access_token',
		access_token: 'public-read-only-discovery-token',
		token_type: 'Bearer',
		scope: discoveryApi.scope,
		note: 'This token is only a public-read-only discovery credential. No private APIs are exposed by this site.',
	});
