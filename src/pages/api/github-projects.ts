import { createClient } from '@vercel/kv';
import type { APIRoute } from 'astro';
import { AxiosError } from 'axios';
import type { TopLanguages, TrimTopLanguagesResult } from '../../types';
import fetchTopLanguages from '../../utils/fetch-top-languages';
import { trimTopLanguages } from '../../utils/utils';

const kv = createClient({
	url: import.meta.env.KV_REST_API_URL,
	token: import.meta.env.KV_REST_API_TOKEN,
});

const headers = new Headers([['Content-Type', 'application/json']]);

export const GET: APIRoute = async () => {
	try {
		const trimTopLanguages = await getTrimTopLanguages();
		return new Response(JSON.stringify(trimTopLanguages), { headers });
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log(error?.response?.data || error);
			return new Response(JSON.stringify({ message: error.response?.data || error.message }), {
				status: 500,
				headers,
			});
		}

		console.log(error);

		if (error instanceof Error) {
			return new Response(JSON.stringify({ message: error.message }), {
				status: 500,
				headers,
			});
		}

		return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
			status: 500,
			headers,
		});
	}
};

async function getTopLanguages() {
	let topLanguages: TopLanguages | null = null;
	const cacheTopLanguagesResponse = await kv.hget<TopLanguages>('github-projects', 'm0hammedimran');

	if (!cacheTopLanguagesResponse) {
		topLanguages = await fetchTopLanguages('m0hammedimran', [
			'angualar-todo-firebase',
			'protoezy-graphy-mock',
			'react-native-todo-app',
			'headlessui-react-type-error-demo',
			'wallpapers',
			'Final-Year-Project',
			'libsol',
		]);

		await kv.hset('github-projects', { m0hammedimran: topLanguages });
		await kv.expire('github-projects', 60 * 60 * 24 * 7);
	}

	topLanguages = topLanguages || cacheTopLanguagesResponse;
	return topLanguages;
}

async function getTrimTopLanguages() {
	let trimmedTopLanguages: TrimTopLanguagesResult | null = null;

	const cacheResponse = await kv.hget<TrimTopLanguagesResult>(
		'github-projects-parsed',
		'm0hammedimran',
	);

	if (!cacheResponse) {
		const topLanguages = await getTopLanguages();
		trimmedTopLanguages = trimTopLanguages({
			topLanguages,
			languagesCount: 10,
			hideLanguages: new Set(['Vim Script', 'AutoHotkey', 'Makefile', 'Shell']),
		});
		await kv.hset('github-projects-parsed', {
			m0hammedimran: trimmedTopLanguages,
		});
		await kv.expire('github-projects-parsed', 60 * 60 * 24 * 7);
	}

	trimmedTopLanguages = trimmedTopLanguages || cacheResponse;

	return trimmedTopLanguages;
}
