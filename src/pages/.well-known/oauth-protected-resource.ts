import type { APIRoute } from 'astro';
import { jsonResponse } from '../../config/agent-discovery';
import { oauthProtectedResourceMetadata } from '../../config/oauth-metadata';

export const GET: APIRoute = () => jsonResponse(oauthProtectedResourceMetadata);
