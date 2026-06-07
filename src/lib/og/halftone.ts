/**
 * Halftone text for OG images.
 *
 * Renders text whose glyphs are filled with a tiled dot pattern instead of
 * solid ink — a clean dot-matrix look. Implemented with a pure SVG
 * <pattern> masked by <text>, so resvg rasterises it with real font metrics.
 */
import { FONT_DISPLAY } from './constants';

export function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export interface HalftoneOptions {
	id: string;
	text: string;
	x: number;
	/** Baseline y. */
	y: number;
	fontSize: number;
	/** Pixel gap between dot centres. Defaults to ~7% of font size. */
	dotGap?: number;
	/** Dot radius. Defaults to ~38% of the gap. */
	dotRadius?: number;
	color?: string;
	fontFamily?: string;
	fontWeight?: number | string;
	letterSpacing?: number;
	/** SVG text-anchor. */
	anchor?: 'start' | 'middle' | 'end';
}

export interface HalftonePart {
	defs: string;
	body: string;
}

export function halftoneText(opts: HalftoneOptions): HalftonePart {
	const {
		id,
		text,
		x,
		y,
		fontSize,
		color = '#37352f',
		fontFamily = FONT_DISPLAY,
		fontWeight = 400,
		letterSpacing = 0,
		anchor = 'start',
	} = opts;

	const gap = opts.dotGap ?? Math.max(4, fontSize * 0.07);
	const r = opts.dotRadius ?? gap * 0.38;

	const textEl = `<text x="${x}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" letter-spacing="${letterSpacing}" text-anchor="${anchor}" fill="#fff">${escapeXml(text)}</text>`;

	const defs = `
<pattern id="dots-${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse">
  <circle cx="${gap / 2}" cy="${gap / 2}" r="${r}" fill="${color}" />
</pattern>
<mask id="mask-${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">${textEl}</mask>`;

	const body = `<rect x="0" y="0" width="100%" height="100%" fill="url(#dots-${id})" mask="url(#mask-${id})" />`;

	return { defs, body };
}
