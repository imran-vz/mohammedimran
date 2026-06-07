/**
 * OG image SVG composer.
 *
 * Builds a dot-matrix OG image: a faint full-bleed backdrop of real GitHub
 * contributions, halftone "IMRAN" + role/title, and a mono footer.
 * Three variants: default (1200×630), square (1080×1080), story (1080×1920).
 */
import { BG, FONT_MONO, INK, MUTED } from './constants';
import { OG_WEEKS, type OgContributions } from './contributions';
import { escapeXml, type HalftonePart, halftoneText } from './halftone';

export type OgVariant = 'default' | 'square' | 'story';

export interface OgInput {
	variant: OgVariant;
	contrib: OgContributions;
	title?: string;
	subtitle?: string;
}

const BACKDROP_ALPHA = [0, 0.05, 0.1, 0.16, 0.24];

interface Layout {
	w: number;
	h: number;
	pad: number;
	nameSize: number;
	nameBaseline: number;
	lineSize: number;
	subSize: number;
	footSize: number;
}

const LAYOUTS: Record<OgVariant, Layout> = {
	default: { w: 1200, h: 630, pad: 72, nameSize: 176, nameBaseline: 312, lineSize: 46, subSize: 26, footSize: 22 },
	square: { w: 1080, h: 1080, pad: 90, nameSize: 188, nameBaseline: 520, lineSize: 50, subSize: 30, footSize: 26 },
	story: { w: 1080, h: 1920, pad: 96, nameSize: 196, nameBaseline: 980, lineSize: 54, subSize: 32, footSize: 28 },
};

function backdrop(grid: number[][], w: number, h: number): string {
	const colW = w / OG_WEEKS;
	const rowH = h / 7;
	const r = Math.min(colW, rowH) * 0.3;
	const dots: string[] = [];
	for (let c = 0; c < grid.length; c++) {
		for (let d = 0; d < 7; d++) {
			const level = grid[c][d] ?? 0;
			const alpha = BACKDROP_ALPHA[level] ?? 0;
			if (alpha <= 0) continue;
			const cx = (c + 0.5) * colW;
			const cy = (d + 0.5) * rowH;
			dots.push(
				`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${INK}" fill-opacity="${alpha}" />`,
			);
		}
	}
	return dots.join('');
}

function wrap(text: string, maxChars: number, maxLines: number): string[] {
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let line = '';
	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (next.length > maxChars && line) {
			lines.push(line);
			line = word;
			if (lines.length === maxLines - 1) break;
		} else {
			line = next;
		}
	}
	if (line && lines.length < maxLines) lines.push(line);
	const used = lines.join(' ').length;
	if (used < text.length && lines.length) {
		lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,;:\s]+$/, '')}…`;
	}
	return lines;
}

export function buildOgSvg({ variant, contrib, title, subtitle }: OgInput): string {
	const L = LAYOUTS[variant];
	const parts: HalftonePart[] = [];

	// halftone name
	parts.push(
		halftoneText({
			id: 'name',
			text: 'IMRAN',
			x: L.pad,
			y: L.nameBaseline,
			fontSize: L.nameSize,
			color: INK,
			letterSpacing: L.nameSize * 0.01,
		}),
	);

	let cursor = L.nameBaseline + L.lineSize + L.nameSize * 0.12;
	const textBlocks: string[] = [];

	if (title) {
		// per-page: solid mono title for legibility of arbitrary text
		const maxChars = Math.floor((L.w - L.pad * 2) / (L.lineSize * 0.62));
		const lines = wrap(title, maxChars, 2);
		for (const ln of lines) {
			textBlocks.push(
				`<text x="${L.pad}" y="${cursor}" font-family="${FONT_MONO}" font-size="${L.lineSize}" font-weight="700" fill="${INK}">${escapeXml(ln)}</text>`,
			);
			cursor += L.lineSize * 1.18;
		}
	} else {
		// brand: halftone role line
		parts.push(
			halftoneText({
				id: 'role',
				text: 'FULL STACK DEVELOPER',
				x: L.pad,
				y: cursor,
				fontSize: L.lineSize,
				color: INK,
				dotGap: Math.max(3.2, L.lineSize * 0.08),
				letterSpacing: L.lineSize * 0.02,
			}),
		);
		cursor += L.lineSize * 0.9;
	}

	const sub = subtitle ?? (title ? undefined : 'React · TypeScript · Go · Rust');
	if (sub) {
		cursor += L.subSize * 0.6;
		textBlocks.push(
			`<text x="${L.pad}" y="${cursor}" font-family="${FONT_MONO}" font-size="${L.subSize}" font-weight="400" fill="${MUTED}">${escapeXml(sub)}</text>`,
		);
	}

	// footer
	const footY = L.h - L.pad * 0.7;
	const brand = `<text x="${L.pad}" y="${footY}" font-family="${FONT_MONO}" font-size="${L.footSize}" font-weight="700" fill="${INK}">imran.codes</text>`;
	const right = `${contrib.total.toLocaleString()} contributions · Bengaluru, India`;
	const footRight = `<text x="${L.w - L.pad}" y="${footY}" font-family="${FONT_MONO}" font-size="${L.footSize}" font-weight="400" fill="${MUTED}" text-anchor="end">${escapeXml(right)}</text>`;

	const defs = parts.map((p) => p.defs).join('\n');
	const halftoneBodies = parts.map((p) => p.body).join('\n');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${L.w}" height="${L.h}" viewBox="0 0 ${L.w} ${L.h}">
<defs>${defs}</defs>
<rect width="${L.w}" height="${L.h}" fill="${BG}" />
<g>${backdrop(contrib.grid, L.w, L.h)}</g>
${halftoneBodies}
${textBlocks.join('\n')}
${brand}
${footRight}
</svg>`;
}
