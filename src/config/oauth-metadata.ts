import { absoluteUrl, discoveryApi, siteUrl } from './agent-discovery';

export const scopesSupported = [discoveryApi.scope];

export const oauthAuthorizationServerMetadata = {
	issuer: siteUrl,
	authorization_endpoint: absoluteUrl('/oauth/authorize'),
	token_endpoint: absoluteUrl('/oauth/token'),
	jwks_uri: absoluteUrl('/.well-known/jwks.json'),
	registration_endpoint: absoluteUrl('/agent/register'),
	service_documentation: absoluteUrl('/auth.md'),
	resource: siteUrl,
	authorization_servers: [siteUrl],
	bearer_methods_supported: ['header'],
	grant_types_supported: ['client_credentials'],
	response_types_supported: ['token'],
	token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
	scopes_supported: scopesSupported,
	code_challenge_methods_supported: ['S256'],
	agent_auth: {
		skill: absoluteUrl('/auth.md'),
		register_uri: absoluteUrl('/agent/register'),
		identity_types_supported: ['anonymous'],
		supported_identity_types: ['anonymous'],
		credential_types_supported: ['access_token'],
		claim_uri: absoluteUrl('/agent/claim'),
		revocation_uri: absoluteUrl('/agent/revoke'),
		anonymous: {
			credential_types_supported: ['access_token'],
			claim_uri: absoluteUrl('/agent/claim'),
		},
		events_supported: ['credential.revoked'],
	},
};

export const oauthProtectedResourceMetadata = {
	resource: siteUrl,
	resource_name: 'Imran.codes public portfolio and agent discovery resources',
	authorization_servers: [siteUrl],
	scopes_supported: scopesSupported,
	bearer_methods_supported: ['header'],
	resource_documentation: absoluteUrl('/auth.md'),
};
