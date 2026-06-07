/**
 * GitHub contribution data.
 *
 * Ported for Astro from the jalco-ui activity-graph registry item
 * (ui.justinlevine.me). The original relied on Next.js ISR; here we fetch
 * server-side at request time. Data comes from the github-contributions-api
 * by Jonathan Gruber (@grubersjoe) — no API key required.
 *
 * Attribution: https://github.com/grubersjoe/github-contributions-api
 */

export interface ActivityEntry {
	/** ISO date string (YYYY-MM-DD). */
	date: string;
	/** Activity count for this date. */
	count: number;
	/** GitHub intensity level 0–4. */
	level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributions {
	/** Total contributions in the period. */
	total: number;
	/** Per-day contribution entries (full window, including empty days). */
	entries: ActivityEntry[];
}

interface ApiResponse {
	total: Record<string, number>;
	contributions: ActivityEntry[];
}

/**
 * Fetch the trailing-year contribution data for a GitHub user.
 * Returns `null` if the request fails or produces no data.
 */
export async function fetchGitHubContributions(username: string): Promise<GitHubContributions | null> {
	try {
		const response = await fetch(
			`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`,
			{ headers: { Accept: 'application/json', 'User-Agent': 'imran.codes/1.0' } },
		);

		if (!response.ok) return null;

		const data: ApiResponse = await response.json();
		const entries = data.contributions ?? [];
		const total = Object.values(data.total ?? {}).reduce((sum, n) => sum + n, 0);

		if (entries.length === 0 && total === 0) return null;

		return { total, entries };
	} catch {
		return null;
	}
}
