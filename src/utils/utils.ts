import type { TrimTopLanguagesArgs, TrimTopLanguagesResult } from '../types';

/**
 * Lowercase and trim string.
 *
 * @param {string} name String to lowercase and trim.
 * @returns {string} Lowercased and trimmed string.
 */
const lowercaseTrim = (name: string): string => {
	if (!name) return '';
	return name.toLowerCase().trim();
};

const MAXIMUM_LANGS_COUNT = 20;

function emptyTopLanguagesResult(): TrimTopLanguagesResult {
	return {
		languages: [],
		totalLanguageSize: 0,
	};
}

function hiddenLanguageNames(hideLanguages: TrimTopLanguagesArgs['hideLanguages']): Set<string> {
	if (hideLanguages instanceof Set) return hideLanguages;
	if (!Array.isArray(hideLanguages)) return new Set();

	return new Set(hideLanguages.map(lowercaseTrim));
}

/**
 * Trim top languages to lang_count while also hiding certain languages.
 *
 * @returns Trimmed top languages and total size.
 */
export function trimTopLanguages({ topLanguages, languagesCount, hideLanguages }: TrimTopLanguagesArgs) {
	if (!topLanguages) return emptyTopLanguagesResult();

	const langsCount = clampValue(languagesCount, 1, MAXIMUM_LANGS_COUNT);
	const langsToHide = hiddenLanguageNames(hideLanguages);

	// filter out languages to be hidden
	const languages = Object.values(topLanguages)
		.sort((a, b) => b.size - a.size)
		.filter((lang) => !langsToHide.has(lowercaseTrim(lang.name)))
		.slice(0, langsCount);

	const totalLanguageSize = languages.reduce((acc, curr) => acc + curr.size, 0);

	return { languages, totalLanguageSize } satisfies TrimTopLanguagesResult;
}

/**
 * Clamp the given number between the given range.
 *
 * @param {number} number The number to clamp.
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} The clamped number.
 */
export function clampValue(number: number, min: number, max: number): number {
	if (Number.isNaN(Number.parseInt(String(number), 10))) {
		return min;
	}

	return Math.max(min, Math.min(number, max));
}
