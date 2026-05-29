import type { APIRoute } from 'astro';
import { absoluteUrl, discoveryApi, jsonResponse } from '../../config/agent-discovery';

export const GET: APIRoute = () =>
	jsonResponse({
		status: 'ok',
		service: discoveryApi.name,
		version: discoveryApi.version,
		resources: {
			api_catalog: absoluteUrl('/.well-known/api-catalog'),
			openapi: absoluteUrl('/.well-known/openapi.json'),
			oauth_authorization_server: absoluteUrl('/.well-known/oauth-authorization-server'),
			oauth_protected_resource: absoluteUrl('/.well-known/oauth-protected-resource'),
			mcp_server_card: absoluteUrl('/.well-known/mcp/server-card.json'),
			agent_skills: absoluteUrl('/.well-known/agent-skills/index.json'),
		},
	});
