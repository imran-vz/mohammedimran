import type { APIRoute } from 'astro';
import {
	agentToolDefinitions,
	contactLinks,
	corsHeaders,
	jsonResponse,
	mcpServer,
	publicProjects,
	siteSummary,
} from '../config/agent-discovery';
import type { JsonValue } from '../config/agent-discovery';

type ToolCallParams = {
	/** Unparsed tool name from the client; compared against known tool ids before use. */
	name?: unknown;
};

type JsonRpcRequest = {
	jsonrpc?: string;
	id?: string | number | null;
	method?: string;
	params?: ToolCallParams;
};

const protocolVersion = mcpServer.protocolVersions[0];

const mcpTools = agentToolDefinitions.map((tool) => ({
	name: tool.name,
	title: tool.title,
	description: tool.description,
	inputSchema: tool.inputSchema,
	annotations: tool.annotations,
}));

const toolResult = (data: JsonValue) => ({
	content: [
		{
			type: 'text',
			text: JSON.stringify(data, null, 2),
		},
	],
});

const success = (id: JsonRpcRequest['id'], result: JsonValue) => ({ jsonrpc: '2.0', id: id ?? null, result });
const failure = (id: JsonRpcRequest['id'], code: number, message: string) => ({
	jsonrpc: '2.0',
	id: id ?? null,
	error: { code, message },
});

const handleRequest = (request: JsonRpcRequest) => {
	switch (request.method) {
		case 'initialize':
			return success(request.id, {
				protocolVersion,
				capabilities: {
					tools: { listChanged: false },
					resources: {},
					prompts: {},
				},
				serverInfo: {
					name: 'imran-codes-portfolio',
					version: mcpServer.version,
				},
			});
		case 'notifications/initialized':
			return null;
		case 'tools/list':
			return success(request.id, { tools: mcpTools });
		case 'tools/call': {
			const name = request.params?.name;

			if (name === 'get_site_summary') {
				return success(request.id, toolResult(siteSummary));
			}

			if (name === 'list_projects') {
				return success(request.id, toolResult(publicProjects));
			}

			if (name === 'get_contact_links') {
				return success(request.id, toolResult(contactLinks));
			}

			return failure(request.id, -32602, `Unknown tool: ${String(name)}`);
		}
		case 'resources/list':
			return success(request.id, { resources: [] });
		case 'prompts/list':
			return success(request.id, { prompts: [] });
		case 'ping':
			return success(request.id, {});
		default:
			return failure(request.id, -32601, `Method not found: ${String(request.method)}`);
	}
};

export const GET: APIRoute = () =>
	jsonResponse({
		name: 'imran-codes-portfolio',
		version: mcpServer.version,
		transport: 'streamable-http',
		protocolVersion,
		tools: mcpTools,
	});

export const OPTIONS: APIRoute = () => new Response(null, { headers: corsHeaders });

export const POST: APIRoute = async ({ request }) => {
	let payload: JsonRpcRequest | JsonRpcRequest[];

	try {
		// SAFETY: every JsonRpcRequest field is optional and read defensively in handleRequest,
		// so any JSON body shape is answered; null/undefined fall back to {} because property
		// access would throw on them.
		payload = ((await request.json()) ?? {}) as JsonRpcRequest | JsonRpcRequest[];
	} catch {
		return jsonResponse(failure(null, -32700, 'Parse error'), { status: 400 });
	}

	const result = Array.isArray(payload) ? payload.map(handleRequest).filter(Boolean) : handleRequest(payload);

	if (result === null) {
		return new Response(null, { status: 202, headers: corsHeaders });
	}

	return jsonResponse(result);
};
