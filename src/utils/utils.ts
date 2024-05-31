/*!
 * word-wrap <https://github.com/jonschlinkert/word-wrap>
 *
 * Copyright (c) 2014-2023, Jon Schlinkert.
 * Released under the MIT License.
 */

import type { TrimTopLanguagesArgs, TrimTopLanguagesResult } from "../types";

function trimEnd(str: string) {
	let lastCharPos = str.length - 1;
	let lastChar = str[lastCharPos];
	while (lastChar === " " || lastChar === "\t") {
		lastChar = str[--lastCharPos];
	}
	return str.substring(0, lastCharPos + 1);
}

/**
 * Lowercase and trim string.
 *
 * @param {string} name String to lowercase and trim.
 * @returns {string} Lowercased and trimmed string.
 */
const lowercaseTrim = (name: string): string => {
	if (!name) return "";
	return name.toLowerCase().trim();
};

const MAXIMUM_LANGS_COUNT = 20;

/**
 * Trim top languages to lang_count while also hiding certain languages.
 *
 * @returns Trimmed top languages and total size.
 */
export function trimTopLanguages({
	topLanguages,
	languagesCount,
	hideLanguages,
}: TrimTopLanguagesArgs) {
	if (!topLanguages)
		return {
			languages: [],
			totalLanguageSize: 0,
		} satisfies TrimTopLanguagesResult;
	let languages = Object.values(topLanguages);
	let langsToHide = new Set<string>();
	const langsCount = clampValue(languagesCount, 1, MAXIMUM_LANGS_COUNT);

	// populate langsToHide map for quick lookup
	// while filtering out
	if (hideLanguages && Array.isArray(hideLanguages)) {
		for (const langName of hideLanguages) {
			langsToHide.add(lowercaseTrim(langName));
		}
	}

	if (hideLanguages && hideLanguages.toString() === "[object Set]") {
		langsToHide = hideLanguages as Set<string>;
	}

	// filter out languages to be hidden
	languages = languages
		.sort((a, b) => b.size - a.size)
		.filter((lang) => !langsToHide.has(lowercaseTrim(lang.name)))
		.slice(0, langsCount);

	const totalLanguageSize = languages.reduce((acc, curr) => acc + curr.size, 0);

	return { languages, totalLanguageSize } satisfies TrimTopLanguagesResult;
}

function trimTabAndSpaces(str: string) {
	const lines = str.split("\n");
	const trimmedLines = lines.map((line) => trimEnd(line));
	return trimmedLines.join("\n");
}

export interface IOptions {
	/**
	 * The width of the text before wrapping to a new line.
	 * @default `50`
	 */
	width?: number;

	/**
	 * The string to use at the beginning of each line.
	 * @default `  ` (two spaces)
	 */
	indent?: string;

	/**
	 * The string to use at the end of each line.
	 * @default `\n`
	 */
	newline?: string;

	/**
	 * An escape function to run on each line after splitting them.
	 * @default (str: string) => string;
	 */
	escape?: (str: string) => string;

	/**
	 * Trim trailing whitespace from the returned string.
	 * This option is included since .trim() would also strip
	 * the leading indentation from the first line.
	 * @default true
	 */
	trim?: boolean;

	/**
	 * Break a word between any two letters when the word is longer
	 * than the specified width.
	 * @default false
	 */
	cut?: boolean;
}
export function wrap(str: string, options: IOptions = {}) {
	if (str == null) {
		return str;
	}

	const width = options.width || 50;
	const indent = typeof options.indent === "string" ? options.indent : "  ";

	const newline = options.newline || `\n${indent}`;
	const escapeFn =
		typeof options.escape === "function" ? options.escape : identity;

	let regexString = `.{1,${width}}`;
	if (options.cut !== true) {
		regexString += "([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)";
	}

	const re = new RegExp(regexString, "g");
	const lines = str.match(re) || [];
	let result =
		indent +
		lines
			.map((line) => {
				if (line.slice(-1) === "\n") {
					line = line.slice(0, line.length - 1);
				}

				return escapeFn(line);
			})
			.join(newline);

	if (options.trim === true) {
		result = trimTabAndSpaces(result);
	}
	return result;
}

function identity(str: string) {
	return str;
}

/**
 * Split text over multiple lines based on the card width.
 *
 * @param {string} text Text to split.
 * @param {number} width Line width in number of characters.
 * @param {number} maxLines Maximum number of lines.
 * @returns {string[]} Array of lines.
 */
export const wrapTextMultiline = (
	text: string,
	width = 59,
	maxLines = 3,
): string[] => {
	const fullWidthComma = "，";
	const encoded = encodeHTML(text);
	const isChinese = encoded.includes(fullWidthComma);

	let wrapped = [];

	if (isChinese) {
		wrapped = encoded.split(fullWidthComma); // Chinese full punctuation
	} else {
		wrapped = wrap(encoded, {
			width,
		}).split("\n"); // Split wrapped lines to get an array of lines
	}

	const lines = wrapped.map((line) => line.trim()).slice(0, maxLines); // Only consider maxLines lines

	// Add "..." to the last line if the text exceeds maxLines
	if (wrapped.length > maxLines) {
		lines[maxLines - 1] += "...";
	}

	// Remove empty lines if text fits in less than maxLines lines
	const multiLineText = lines.filter(Boolean);
	return multiLineText;
};

/**
 * Encode string as HTML.
 *
 * @see https://stackoverflow.com/a/48073476/10629172
 *
 * @param {string} str String to encode.
 * @returns {string} Encoded string.
 */
const encodeHTML = (str: string): string => {
	return str
		.replace(/[\u00A0-\u9999<>&](?!#)/gim, (i) => {
			return `&#${i.charCodeAt(0)};`;
		})
		.replace(/\u0008/gim, "");
};

/**
 * Clamp the given number between the given range.
 *
 * @param {number} number The number to clamp.
 * @param {number} min The minimum value.
 * @param {number} max The maximum value.
 * @returns {number} The clamped number.
 */
export const clampValue = (
	number: number,
	min: number,
	max: number,
): number => {
	if (Number.isNaN(Number.parseInt(String(number), 10))) {
		return min;
	}

	return Math.max(min, Math.min(number, max));
};
