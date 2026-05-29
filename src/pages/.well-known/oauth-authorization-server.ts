import type { APIRoute } from 'astro';
import { jsonResponse } from '../../config/agent-discovery';
import { oauthAuthorizationServerMetadata } from '../../config/oauth-metadata';

export const GET: APIRoute = () => jsonResponse(oauthAuthorizationServerMetadata);
