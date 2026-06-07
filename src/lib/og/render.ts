/**
 * Rasterise an OG SVG to PNG via resvg, using the materialised font files.
 */
import { Resvg } from '@resvg/resvg-js';
import { FONT_MONO } from './constants';
import { getFontFiles } from './fonts';

export function renderPng(svg: string, width: number): Buffer {
	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: width },
		font: { fontFiles: getFontFiles(), loadSystemFonts: false, defaultFontFamily: FONT_MONO },
		background: '#fbfbfa',
	});
	return Buffer.from(resvg.render().asPng());
}
