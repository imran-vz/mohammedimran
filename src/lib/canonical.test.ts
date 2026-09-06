import { describe, expect, it } from 'vite-plus/test';
import { getCanonicalRedirect } from './canonical';

const publicPaths = ['/', '/blog', '/blog/article', '/hire', '/hire/golang-developer', '/skills'];

describe('public content canonical redirects', () => {
	it.each(publicPaths)('normalizes aliases for %s without mutating the URL or looping', (pathname) => {
		const url = new URL(`http://www.imran.codes:8080${pathname}/?ref=portfolio`);
		const original = url.href;
		const redirect = getCanonicalRedirect(url, 'GET');

		expect(redirect?.href).toBe(`https://imran.codes${pathname}?ref=portfolio`);
		expect(url.href).toBe(original);
		expect(redirect).not.toBeNull();
		if (redirect) {
			expect(getCanonicalRedirect(redirect, 'GET')).toBeNull();
		}
	});

	it.each(publicPaths)('leaves the canonical path %s alone, including its query', (pathname) => {
		expect(getCanonicalRedirect(new URL(`https://imran.codes${pathname}?ref=portfolio`), 'GET')).toBeNull();
	});

	it.each(publicPaths.slice(1))('normalizes local HEAD requests to %s', (pathname) => {
		const url = new URL(`http://localhost:4381${pathname}/?ref=portfolio`);
		expect(getCanonicalRedirect(url, 'HEAD')?.href).toBe(`http://localhost:4381${pathname}?ref=portfolio`);
	});

	it('normalizes a www root request without a path change', () => {
		expect(getCanonicalRedirect(new URL('https://www.imran.codes/?ref=portfolio'), 'HEAD')?.href).toBe(
			'https://imran.codes/?ref=portfolio',
		);
	});

	it.each([
		'http://imran.codes',
		'http://127.0.0.1:4381',
		'https://private-preview.vercel.app',
		'https://www.imran.codes.evil',
		'https://sub.www.imran.codes',
	])('preserves the origin %s', (origin) => {
		expect(getCanonicalRedirect(new URL(`${origin}/blog/`), 'GET')?.href).toBe(`${origin}/blog`);
		expect(getCanonicalRedirect(new URL(`${origin}/`), 'GET')).toBeNull();
	});

	it.each(['POST', 'PUT', 'DELETE', 'OPTIONS'])('does not redirect %s requests', (method) => {
		expect(getCanonicalRedirect(new URL('http://www.imran.codes/blog/'), method)).toBeNull();
	});

	it.each([
		'/oauth/token/',
		'/oauth/authorize/',
		'/mcp/',
		'/agent/register/',
		'/_astro/a.js',
		'/.well-known/openapi.json',
		'/robots.txt',
		'/sitemap-blog.xml',
		'/blog/article/child/',
		'/hire/golang-developer/child/',
		'/skills/child/',
		'/other/blog/',
		'/blogger/',
		'/blog//article/',
	])('excludes %s even on the www host', (pathname) => {
		expect(getCanonicalRedirect(new URL(`http://www.imran.codes${pathname}`), 'GET')).toBeNull();
	});
});
