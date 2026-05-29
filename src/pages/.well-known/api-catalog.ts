import type { APIRoute } from 'astro';
import { absoluteUrl, discoveryApi } from '../../config/agent-discovery';

const apiCatalog = {
	linkset: [
		{
			anchor: absoluteUrl('/.well-known/api-catalog'),
			'service-desc': [
				{
					href: absoluteUrl('/.well-known/openapi.json'),
					type: 'application/vnd.oai.openapi+json;version=3.1',
					title: `${discoveryApi.name} OpenAPI description`,
				},
			],
			'service-doc': [
				{
					href: absoluteUrl('/auth.md'),
					type: 'text/markdown',
					title: 'Agent authentication and registration notes',
				},
			],
			status: [
				{
					href: absoluteUrl('/.well-known/status.json'),
					type: 'application/json',
					title: 'Discovery metadata status',
				},
			],
		},
	],
};

const headers = {
	'Cache-Control': 'public, max-age=3600',
	'Content-Type': 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"; charset=utf-8',
	Link: `<${absoluteUrl('/.well-known/api-catalog')}>; rel="api-catalog"; type="application/linkset+json"`,
};

export const GET: APIRoute = () =>
	new Response(JSON.stringify(apiCatalog, null, 2), {
		headers,
	});

export const HEAD: APIRoute = () => new Response(null, { headers });
