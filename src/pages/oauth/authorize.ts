import type { APIRoute } from 'astro';
import { absoluteUrl } from '../../config/agent-discovery';
import { oauthAuthorizationServerMetadata } from '../../config/oauth-metadata';

export const GET: APIRoute = () =>
	new Response(
		`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>OAuth authorization</title></head><body><main><h1>OAuth authorization</h1><p>Imran.codes currently exposes public read-only discovery resources. No interactive OAuth authorization is required for public metadata.</p><p>See <a href="${absoluteUrl('/auth.md')}">auth.md</a> and <a href="${absoluteUrl('/.well-known/oauth-authorization-server')}">OAuth metadata</a>.</p><pre>${JSON.stringify(oauthAuthorizationServerMetadata, null, 2)}</pre></main></body></html>`,
		{
			headers: {
				'Cache-Control': 'public, max-age=3600',
				'Content-Type': 'text/html; charset=utf-8',
			},
		},
	);
