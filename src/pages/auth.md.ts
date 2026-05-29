import type { APIRoute } from 'astro';
import { absoluteUrl, discoveryApi, siteUrl } from '../config/agent-discovery';
import { oauthAuthorizationServerMetadata, oauthProtectedResourceMetadata } from '../config/oauth-metadata';

const authMarkdown = `# auth.md for Imran.codes

Imran.codes publishes public, read-only portfolio and agent-discovery resources. The public site does not expose private user data APIs. Agent-facing discovery metadata is available without authentication, and OAuth metadata is published so agents can discover the expected authentication shape if protected resources are added later.

## Audience

AI agents, crawlers, and developer tools discovering Imran's portfolio, public project metadata, contact links, and agent-readiness resources.

## Discovery endpoints

- API catalog: ${absoluteUrl('/.well-known/api-catalog')}
- OpenAPI description: ${absoluteUrl('/.well-known/openapi.json')}
- OAuth Authorization Server metadata: ${absoluteUrl('/.well-known/oauth-authorization-server')}
- OAuth Protected Resource metadata: ${absoluteUrl('/.well-known/oauth-protected-resource')}
- MCP Server Card: ${absoluteUrl('/.well-known/mcp/server-card.json')}
- Agent Skills index: ${absoluteUrl('/.well-known/agent-skills/index.json')}

## OAuth resource metadata

\`\`\`json
${JSON.stringify(oauthProtectedResourceMetadata, null, 2)}
\`\`\`

## Agent registration

Registration endpoint: ${oauthAuthorizationServerMetadata.agent_auth.register_uri}

Supported identity types:

- anonymous

Supported credential types:

- bearer_token

Supported scopes:

- ${discoveryApi.scope}: read public discovery and portfolio metadata

Claim URI: ${oauthAuthorizationServerMetadata.agent_auth.claim_uri}

Revocation URI: ${oauthAuthorizationServerMetadata.agent_auth.revocation_uri}

## Notes for agents

- Use the public discovery endpoints first; authentication is not required for public portfolio metadata.
- Send bearer tokens in the \`Authorization: Bearer <token>\` header when interacting with future protected resources.
- Do not submit private or sensitive data to the public discovery endpoints.

Issuer: ${siteUrl}
`;

export const GET: APIRoute = () =>
	new Response(authMarkdown, {
		headers: {
			'Cache-Control': 'public, max-age=3600',
			'Content-Type': 'text/markdown; charset=utf-8',
		},
	});
