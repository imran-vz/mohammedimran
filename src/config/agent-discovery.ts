import { allProjects } from '../data/projects';
import { siteMeta } from './siteMeta';

export const siteUrl = siteMeta.siteUrl.replace(/\/$/, '');

export const absoluteUrl = (path: string) => new URL(path, `${siteUrl}/`).toString();

export const discoveryApi = {
	name: 'Imran.codes Agent Discovery API',
	version: '0.1.0',
	scope: 'agent.discovery.read',
	description:
		'Read-only discovery metadata for Imran.codes, including portfolio links, skills, and agent-facing service documents.',
};

export const mcpServer = {
	name: 'codes.imran/portfolio',
	displayName: 'Imran.codes Portfolio MCP',
	version: '0.1.0',
	description:
		'Read-only MCP server exposing public portfolio metadata, project links, contact links, and site discovery documents.',
	protocolVersions: ['2025-06-18'],
};

export const agentToolDefinitions = [
	{
		name: 'get_site_summary',
		title: 'Get site summary',
		description:
			'Return a concise summary of Imran, specialties, location, and availability from the public portfolio.',
		inputSchema: {
			type: 'object',
			properties: {},
			additionalProperties: false,
		},
		annotations: {
			readOnlyHint: true,
		},
	},
	{
		name: 'list_projects',
		title: 'List projects',
		description: 'Return selected public projects with descriptions, technologies, and source URLs.',
		inputSchema: {
			type: 'object',
			properties: {},
			additionalProperties: false,
		},
		annotations: {
			readOnlyHint: true,
		},
	},
	{
		name: 'get_contact_links',
		title: 'Get contact links',
		description: 'Return public contact and social links for Imran.',
		inputSchema: {
			type: 'object',
			properties: {},
			additionalProperties: false,
		},
		annotations: {
			readOnlyHint: true,
		},
	},
];

export const siteSummary = {
	name: siteMeta.brandLong,
	url: siteUrl,
	description: siteMeta.defaultDescription,
	location: siteMeta.location,
	employer: siteMeta.employer,
	availability: 'Available for freelance and contract engagements',
	specialties: ['React', 'TypeScript', 'Go', 'Rust', 'Full Stack Development'],
};

export const contactLinks = {
	email: `mailto:${siteMeta.email}`,
	github: siteMeta.social.github,
	linkedin: siteMeta.social.linkedin,
	twitter: siteMeta.social.twitterUrl,
};

export const publicProjects = allProjects.map((project) => ({
	name: project.name,
	description: project.description,
	technologies: project.tech,
	url: project.url,
}));

export const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, MCP-Protocol-Version',
};

export const jsonHeaders = {
	...corsHeaders,
	'Cache-Control': 'public, max-age=3600',
	'Content-Type': 'application/json; charset=utf-8',
};

export const jsonResponse = (data: unknown, init: ResponseInit = {}) =>
	new Response(JSON.stringify(data, null, 2), {
		...init,
		headers: {
			...jsonHeaders,
			...Object.fromEntries(new Headers(init.headers).entries()),
		},
	});
