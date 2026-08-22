/**
 * Contribution grid for OG images.
 *
 * Fetches real GitHub data (via the shared helper), packs it into a trailing
 * 53-week × 7-day level grid, and memoises for an hour. Falls back to a
 * deterministic pseudo-grid if the API is unavailable so the image never breaks.
 */
import { fetchGitHubContributions } from '../github';

export const OG_WEEKS = 53;

export interface OgContributions {
	/** [week][day] intensity level 0–4. */
	grid: number[][];
	total: number;
}

let cache: { at: number; data: OgContributions } | null = null;
const TTL = 3_600_000;

function toGrid(entries: { date: string; level: number }[]): number[][] {
	const byDate = new Map<string, number>();
	for (const e of entries) byDate.set(e.date, e.level);

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const end = new Date(today);
	end.setDate(today.getDate() + (6 - today.getDay()));
	const start = new Date(end);
	start.setDate(end.getDate() - OG_WEEKS * 7 + 1);

	const grid: number[][] = [];
	for (let w = 0; w < OG_WEEKS; w++) {
		const col: number[] = [];
		for (let d = 0; d < 7; d++) {
			const day = new Date(start);
			day.setDate(start.getDate() + w * 7 + d);
			col.push(byDate.get(day.toISOString().slice(0, 10)) ?? 0);
		}
		grid.push(col);
	}
	return grid;
}

function fallback(): OgContributions {
	const grid: number[][] = [];
	let total = 0;
	for (let w = 0; w < OG_WEEKS; w++) {
		const col: number[] = [];
		for (let d = 0; d < 7; d++) {
			// deterministic noise so previews look plausible offline
			const n = Math.sin(w * 12.9898 + d * 78.233) * 43758.5453;
			const level = Math.floor((n - Math.floor(n)) * 5);
			col.push(level);
			total += level;
		}
		grid.push(col);
	}
	return { grid, total };
}

export async function getOgContributions(username = 'imran-vz'): Promise<OgContributions> {
	if (cache && Date.now() - cache.at < TTL) return cache.data;

	const res = await fetchGitHubContributions(username);
	const data: OgContributions = res ? { grid: toGrid(res.entries), total: res.total } : fallback();

	cache = { at: Date.now(), data };
	return data;
}
