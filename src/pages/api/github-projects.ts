import type { APIRoute } from 'astro';
import { env } from '../../config/env';
import { cachedHashFetch, handleApiError } from '../../lib/cache';
import type { TopLanguages, TrimTopLanguagesResult } from '../../types';
import fetchTopLanguages from '../../utils/fetch-top-languages';
import { trimTopLanguages } from '../../utils/utils';

const SEVEN_DAYS = 60 * 60 * 24 * 7;
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
			'github-projects-parsed',
			env.githubUsername,
			async () => {
				const topLanguages = await cachedHashFetch<TopLanguages>(
					'github-projects',
					env.githubUsername,
					() => fetchTopLanguages(env.githubUsername, EXCLUDED_REPOS),
					SEVEN_DAYS,
				);

				return trimTopLanguages({
					topLanguages,
					languagesCount: 10,
					hideLanguages: HIDDEN_LANGUAGES,
				});
			},
			SEVEN_DAYS,
		);

		return new Response(JSON.stringify(result), { headers });
	} catch (error) {
		return handleApiError(error);
	}
};
