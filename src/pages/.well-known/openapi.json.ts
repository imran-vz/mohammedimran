import type { APIRoute } from 'astro';
import { absoluteUrl, discoveryApi, jsonResponse } from '../../config/agent-discovery';

const openApiDocument = {
	openapi: '3.1.0',
	info: {
		title: discoveryApi.name,
		version: discoveryApi.version,
		description: discoveryApi.description,
	},
	servers: [{ url: absoluteUrl('/') }],
	paths: {
		'/.well-known/api-catalog': {
			get: {
				summary: 'API catalog',
				description: 'RFC 9727 API catalog using RFC 9264 Linkset JSON.',
				responses: {
					'200': {
						description: 'Linkset API catalog',
						content: {
							'application/linkset+json': {
								schema: { type: 'object' },
							},
						},
					},
				},
			},
		},
		'/.well-known/oauth-authorization-server': {
			get: {
				summary: 'OAuth authorization server metadata',
				responses: { '200': { description: 'OAuth metadata document' } },
			},
		},
		'/.well-known/oauth-protected-resource': {
			get: {
				summary: 'OAuth protected resource metadata',
				responses: { '200': { description: 'Protected resource metadata document' } },
			},
		},
		'/.well-known/agent-skills/index.json': {
			get: {
				summary: 'Agent Skills discovery index',
				responses: { '200': { description: 'Agent Skills index' } },
			},
		},
		'/.well-known/mcp/server-card.json': {
			get: {
				summary: 'MCP Server Card',
				responses: { '200': { description: 'MCP Server Card metadata' } },
			},
		},
		'/mcp': {
			post: {
				summary: 'MCP Streamable HTTP endpoint',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { type: 'object' },
						},
					},
				},
				responses: { '200': { description: 'JSON-RPC response' } },
			},
		},
		'/auth.md': {
			get: {
				summary: 'Auth.md agent registration instructions',
				responses: { '200': { description: 'Markdown registration instructions' } },
			},
		},
	},
};

export const GET: APIRoute = () =>
	jsonResponse(openApiDocument, {
		headers: {
			'Content-Type': 'application/vnd.oai.openapi+json; charset=utf-8',
		},
	});
