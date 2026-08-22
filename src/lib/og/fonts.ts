/**
 * Font files for OG image rendering.
 *
 * TTFs are inlined at build time (`?inline` -> base64 data URI) so they ride
 * inside the serverless bundle. resvg-js 2.6.2 ignores `fontBuffers`, so we
 * materialise them to a temp dir once and hand resvg real file paths.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import antonData from '../../assets/og-fonts/Anton-Regular.ttf?inline';
import monoBoldData from '../../assets/og-fonts/SpaceMono-Bold.ttf?inline';
import monoData from '../../assets/og-fonts/SpaceMono-Regular.ttf?inline';

function toBuffer(dataUri: string): Buffer {
	const marker = 'base64,';
	const idx = dataUri.indexOf(marker);
	const b64 = idx >= 0 ? dataUri.slice(idx + marker.length) : dataUri;
	return Buffer.from(b64, 'base64');
}

const SOURCES: [string, string][] = [
	['Anton-Regular.ttf', antonData],
	['SpaceMono-Regular.ttf', monoData],
	['SpaceMono-Bold.ttf', monoBoldData],
];

let cachedPaths: string[] | null = null;

export function getFontFiles(): string[] {
	if (cachedPaths) return cachedPaths;

	const dir = join(tmpdir(), 'imran-og-fonts');
	mkdirSync(dir, { recursive: true });

	cachedPaths = SOURCES.map(([name, data]) => {
		const path = join(dir, name);
		writeFileSync(path, toBuffer(data));
		return path;
	});

	return cachedPaths;
}
