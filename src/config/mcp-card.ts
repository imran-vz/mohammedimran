import { absoluteUrl, mcpServer } from './agent-discovery';

export const mcpServerCard = {
	$schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
	name: mcpServer.name,
	version: mcpServer.version,
	title: mcpServer.displayName,
	description: mcpServer.description,
	websiteUrl: absoluteUrl('/'),
	serverInfo: {
		name: 'imran-codes-portfolio',
		version: mcpServer.version,
	},
	transport: {
		type: 'streamable-http',
		endpoint: absoluteUrl('/mcp'),
	},
	transports: [
		{
			type: 'streamable-http',
			url: absoluteUrl('/mcp'),
			supportedProtocolVersions: mcpServer.protocolVersions,
		},
	],
	remotes: [
		{
			type: 'streamable-http',
			url: absoluteUrl('/mcp'),
			supportedProtocolVersions: mcpServer.protocolVersions,
		},
	],
	capabilities: {
		tools: {
			listChanged: false,
		},
		resources: {},
		prompts: {},
	},
};
