import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteMeta } from '../config/siteMeta';

export const prerender = true;

export const GET: APIRoute = async () => {
	const posts = await getCollection('blog');
	const urls = posts.map((post) => {
		const url = new URL(`/blog/${post.id}`, siteMeta.siteUrl).href
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll("'", '&apos;');
		return `<url><loc>${url}</loc></url>`;
	});

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
		{ headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
	);
};
