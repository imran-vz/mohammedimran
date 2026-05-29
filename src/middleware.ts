import { defineMiddleware } from 'astro:middleware';
import TurndownService from 'turndown';

const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

const turndownService = new TurndownService({
	bulletListMarker: '-',
	codeBlockStyle: 'fenced',
	headingStyle: 'atx',
});

turndownService.remove(['script', 'style', 'noscript', 'svg', 'template']);

turndownService.addRule('skipHiddenContent', {
	filter: (node) => {
		if (node.nodeType !== 1) {
			return false;
		}

		const element = node as Element;
		return element.hasAttribute('hidden') || element.getAttribute('aria-hidden') === 'true';
	},
	replacement: () => '',
});

turndownService.addRule('spaceSeparatedSpans', {
	filter: 'span',
	replacement: (content) => (content.trim() ? `${content} ` : ''),
});

const acceptsMarkdown = (acceptHeader: string | null) => {
	if (!acceptHeader) {
		return false;
	}

	return acceptHeader.split(',').some((entry) => {
		const [mediaType, ...parameters] = entry.trim().split(';');
		const qValue = parameters
			.map((parameter) => parameter.trim())
			.find((parameter) => parameter.toLowerCase().startsWith('q='));
		const quality = qValue ? Number.parseFloat(qValue.slice(2)) : 1;

		return mediaType.toLowerCase() === 'text/markdown' && quality > 0;
	});
};

const appendVaryAccept = (headers: Headers) => {
	const vary = headers.get('Vary');

	if (!vary) {
		headers.set('Vary', 'Accept');
		return;
	}

	const values = vary.split(',').map((value) => value.trim().toLowerCase());
	if (values.includes('*') || values.includes('accept')) {
		return;
	}

	headers.set('Vary', `${vary}, Accept`);
};

const extractContentHtml = (html: string) =>
	html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;

const estimateTokenCount = (markdown: string) => markdown.match(/\S+/g)?.length ?? 0;

export const onRequest = defineMiddleware(async ({ request }, next) => {
	if (!acceptsMarkdown(request.headers.get('Accept'))) {
		return next();
	}

	const response = await next();
	const contentType = response.headers.get('Content-Type')?.toLowerCase() ?? '';

	if (!contentType.includes('text/html') || response.status === 204 || response.status === 304) {
		return response;
	}

	const headers = new Headers(response.headers);
	headers.set('Content-Type', MARKDOWN_CONTENT_TYPE);
	headers.delete('Content-Length');
	headers.delete('Content-Encoding');
	headers.delete('ETag');
	appendVaryAccept(headers);

	if (request.method === 'HEAD') {
		headers.set('x-markdown-tokens', '0');
		return new Response(null, {
			headers,
			status: response.status,
			statusText: response.statusText,
		});
	}

	const html = await response.text();
	const markdown = `${turndownService.turndown(extractContentHtml(html)).trim()}\n`;
	headers.set('x-markdown-tokens', String(estimateTokenCount(markdown)));

	return new Response(markdown, {
		headers,
		status: response.status,
		statusText: response.statusText,
	});
});
