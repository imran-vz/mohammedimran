import type { APIRoute } from 'astro';
import { getOgContributions } from '../../lib/og/contributions';
import { renderPng } from '../../lib/og/render';
import { buildOgSvg } from '../../lib/og/template';

export const GET: APIRoute = async ({ url }) => {
	const contrib = await getOgContributions();
	const svg = buildOgSvg({
		variant: 'story',
		contrib,
		title: url.searchParams.get('title') ?? undefined,
		subtitle: url.searchParams.get('subtitle') ?? undefined,
	});

	return new Response(new Uint8Array(renderPng(svg, 1080)), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
		},
	});
};
