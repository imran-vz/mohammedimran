import type { APIRoute } from 'astro';
import { jsonResponse } from '../../config/agent-discovery';
import { mcpServerCard } from '../../config/mcp-card';

export const GET: APIRoute = () => jsonResponse(mcpServerCard);
