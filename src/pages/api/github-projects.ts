import type { APIRoute } from 'astro';
import { env } from '../../config/env';
import { CACHE_KEYS, cachedHashFetch, handleApiError } from '../../lib/cache';
import type { TopLanguages, TrimTopLanguagesResult } from '../../types';
import fetchTopLanguages from '../../utils/fetch-top-languages';
import { trimTopLanguages } from '../../utils/utils';

const EXCLUDED_REPOS = [
	'angualar-todo-firebase',
	'protoezy-graphy-mock',
	'react-native-todo-app',
	'headlessui-react-type-error-demo',
	'wallpapers',
	'Final-Year-Project',
	'libsol',
];
const HIDDEN_LANGUAGES = new Set(['Vim Script', 'AutoHotkey', 'Makefile', 'Shell']);

const headers = new Headers([['Content-Type', 'application/json']]);

export const GET: APIRoute = async () => {
	try {
		const result = await cachedHashFetch<TrimTopLanguagesResult>(
			CACHE_KEYS.githubProjectsParsed.key,
			env.githubUsername,
			async () => {
				const topLanguages = await cachedHashFetch<TopLanguages>(
					CACHE_KEYS.githubProjects.key,
					env.githubUsername,
					() => fetchTopLanguages(env.githubUsername, EXCLUDED_REPOS),
					CACHE_KEYS.githubProjects.ttlSeconds,
				);

				return trimTopLanguages({
					topLanguages,
					languagesCount: 10,
					hideLanguages: HIDDEN_LANGUAGES,
				});
			},
			CACHE_KEYS.githubProjectsParsed.ttlSeconds,
		);

		return new Response(JSON.stringify(result), { headers });
	} catch (error) {
		return handleApiError(error);
	}
};
