// Keep redirects scoped to public content so API and authentication routes retain their behavior.
export const getCanonicalRedirect = (url: URL, method: string) => {
	if (method !== 'GET' && method !== 'HEAD') {
		return null;
	}

	const pathname = url.pathname.replace(/\/+$/, '') || '/';
	if (pathname !== '/' && pathname !== '/skills' && !/^\/(blog|hire)(\/[^/]+)?$/.test(pathname)) {
		return null;
	}

	const redirectUrl = new URL(url);
	redirectUrl.pathname = pathname;
	if (url.hostname === 'www.imran.codes') {
		redirectUrl.protocol = 'https:';
		redirectUrl.hostname = 'imran.codes';
		redirectUrl.port = '';
	}

	return redirectUrl.href === url.href ? null : redirectUrl;
};
