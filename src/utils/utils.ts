/*!
 * word-wrap <https://github.com/jonschlinkert/word-wrap>
 *
 * Copyright (c) 2014-2023, Jon Schlinkert.
 * Released under the MIT License.
 */

import type { Lang } from "./fetch-top-languages";

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
const lowercaseTrim = (name: string): string => name.toLowerCase().trim();

const MAXIMUM_LANGS_COUNT = 20;
/**
 * Trim top languages to lang_count while also hiding certain languages.
 *
 * @param {Record<string, Lang>} topLangs Top languages.
 * @param {number} langs_count Number of languages to show.
 * @param {string[]=} hide Languages to hide.
 * @returns {{ langs: Lang[], totalLanguageSize: number }} Trimmed top languages and total size.
 */
export const trimTopLanguages = (
    topLangs: Record<string, Lang>,
    langs_count: number,
    hide?: string[],
): { langs: Lang[]; totalLanguageSize: number } => {
    let langs = Object.values(topLangs);
    let langsToHide = new Map<string, boolean>();
    let langsCount = clampValue(langs_count, 1, MAXIMUM_LANGS_COUNT);

    // populate langsToHide map for quick lookup
    // while filtering out
    if (hide) {
        hide.forEach((langName) => {
            langsToHide.set(lowercaseTrim(langName), true);
        });
    }

    // filter out languages to be hidden
    langs = langs
        .sort((a, b) => b.size - a.size)
        .filter((lang) => {
            return !langsToHide.has(lowercaseTrim(lang.name));
        })
        .slice(0, langsCount);

    const totalLanguageSize = langs.reduce((acc, curr) => acc + curr.size, 0);

    return { langs, totalLanguageSize };
};

interface FlexLayoutProps {
    items: string[];
    gap: number;
    direction?: ("column" | "row") | undefined;
    sizes?: number[] | undefined;
}
const DEFAULT_LANG_COLOR = "#858585";
/**
 * Renders the default language card layout.
 *
 * @param {Lang[]} langs Array of programming languages.
 * @param {number} width Card width.
 * @param {number} totalLanguageSize Total size of all languages.
 * @returns {string} Normal layout card SVG object.
 */
export const renderNormalLayout = (
    langs: Lang[],
    width: number,
    totalLanguageSize: number,
): string => {
    return flexLayout({
        items: langs.map((lang, index) => {
            return createProgressTextNode({
                width,
                name: lang.name,
                color: lang.color || DEFAULT_LANG_COLOR,
                progress: parseFloat(
                    ((lang.size / totalLanguageSize) * 100).toFixed(2),
                ),

                index,
            });
        }),
        gap: 40,
        direction: "column",
    }).join("");
};

/**
 * Create progress bar text item for a programming language.
 *
 * @param {object} props Function properties.
 * @param {number} props.width The card width
 * @param {string} props.color Color of the programming language.
 * @param {string} props.name Name of the programming language.
 * @param {number} props.progress Usage of the programming language in percentage.
 * @param {number} props.index Index of the programming language.
 * @returns {string} Programming language SVG node.
 */
const createProgressTextNode = ({
    width,
    color,
    name,
    progress,
    index,
}: {
    width: number;
    color: string;
    name: string;
    progress: number;
    index: number;
}): string => {
    const staggerDelay = (index + 3) * 150;
    const paddingRight = 95;
    const progressTextX = width - paddingRight + 10;
    const progressWidth = width - paddingRight;

    return `
      <g class="stagger" style="animation-delay: ${staggerDelay}ms">
        <text data-testid="lang-name" x="2" y="15" class="lang-name">${name}</text>
        <text x="${progressTextX}" y="34" class="lang-name">${progress}%</text>
        ${createProgressNode({
            x: 0,
            y: 25,
            color,
            width: progressWidth,
            progress,
            progressBarBackgroundColor: "#ddd",
            delay: staggerDelay + 300,
        })}
      </g>
    `;
};

/**
 * Create a node to indicate progress in percentage along a horizontal line.
 *
 * @param {Object} createProgressNodeParams Object that contains the createProgressNode parameters.
 * @param {number} createProgressNodeParams.x X-axis position.
 * @param {number} createProgressNodeParams.y Y-axis position.
 * @param {number} createProgressNodeParams.width Width of progress bar.
 * @param {string} createProgressNodeParams.color Progress color.
 * @param {number} createProgressNodeParams.progress Progress value.
 * @param {string} createProgressNodeParams.progressBarBackgroundColor Progress bar bg color.
 * @param {number} createProgressNodeParams.delay Delay before animation starts.
 * @returns {string} Progress node.
 */
const createProgressNode = ({
    x,
    y,
    width,
    color,
    progress,
    progressBarBackgroundColor,
    delay,
}: {
    x: number;
    y: number;
    width: number;
    color: string;
    progress: number;
    progressBarBackgroundColor: string;
    delay: number;
}): string => {
    const progressPercentage = clampValue(progress, 2, 100);

    return `
      <svg width="${width}" x="${x}" y="${y}">
        <rect rx="5" ry="5" x="0" y="0" width="${width}" height="8" fill="${progressBarBackgroundColor}"></rect>
        <svg data-testid="lang-progress" width="${progressPercentage}%">
          <rect
              height="8"
              fill="${color}"
              rx="5" ry="5" x="0" y="0"
              class="lang-progress"
              style="animation-delay: ${delay}ms;"
          />
        </svg>
      </svg>
    `;
};

/**
 * Auto layout utility, allows us to layout things vertically or horizontally with
 * proper gaping.
 *
 * @param {object} props Function properties.
 * @param {string[]} props.items Array of items to layout.
 * @param {number} props.gap Gap between items.
 * @param {"column" | "row"=} props.direction Direction to layout items.
 * @param {number[]=} props.sizes Array of sizes for each item.
 * @returns {string[]} Array of items with proper layout.
 */
export const flexLayout = ({
    items,
    gap,
    direction,
    sizes = [],
}: FlexLayoutProps): string[] => {
    let lastSize = 0;
    // filter() for filtering out empty strings
    return items.filter(Boolean).map((item, i) => {
        const size = sizes[i] || 0;
        let transform = `translate(${lastSize}, 0)`;
        if (direction === "column") {
            transform = `translate(0, ${lastSize})`;
        }
        lastSize += size + gap;
        return `<g transform="${transform}">${item}</g>`;
    });
};

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
export function wrap(str: string, options: IOptions) {
    options = options || {};
    if (str == null) {
        return str;
    }

    let width = options.width || 50;
    let indent = typeof options.indent === "string" ? options.indent : "  ";

    let newline = options.newline || "\n" + indent;
    let escape =
        typeof options.escape === "function" ? options.escape : identity;

    let regexString = ".{1," + width + "}";
    if (options.cut !== true) {
        regexString += "([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)";
    }

    let re = new RegExp(regexString, "g");
    let lines = str.match(re) || [];
    let result =
        indent +
        lines
            .map((line) => {
                if (line.slice(-1) === "\n") {
                    line = line.slice(0, line.length - 1);
                }

                return escape(line);
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
    width: number = 59,
    maxLines: number = 3,
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
            return "&#" + i.charCodeAt(0) + ";";
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
    if (Number.isNaN(parseInt(String(number), 10))) {
        return min;
    }

    return Math.max(min, Math.min(number, max));
};
