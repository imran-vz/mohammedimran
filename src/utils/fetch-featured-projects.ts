import axios from 'axios';

export interface FeaturedProject {
	name: string;
	description: string;
	url: string;
	homepage: string | null;
	stars: number;
	forks: number;
	watchers: number;
	openIssues: number;
	languages: { name: string; percentage: number; bytes: number; color: string }[];
	lastCommitDate: string;
	lastCommitDateFormatted: string;
	topics: string[];
	primaryLanguage: string;
}

const GITHUB_USERNAME = 'imran-vz';
const GITHUB_API = 'https://api.github.com';
const FEATURED_REPOS = ['seer', 'cocoacomaa', 'gosqlit'];

// GitHub Linguist color mapping
const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: '#3178C6',
	JavaScript: '#F7DF1E',
	Go: '#00ADD8',
	Python: '#3776AB',
	Rust: '#DEA584',
	Java: '#007396',
	C: '#555555',
	'C++': '#f34b7d',
	HTML: '#E34F26',
	CSS: '#1572B6',
	Shell: '#89e051',
	Makefile: '#427819',
	Dockerfile: '#384d54',
	Vue: '#41B883',
	Svelte: '#FF3E00',
	React: '#61DAFB',
	Unknown: '#858585',
};

/**
 * Format relative time (e.g., "2 days ago", "3 weeks ago")
 */
function getRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	const intervals = {
		year: 31536000,
		month: 2592000,
		week: 604800,
		day: 86400,
		hour: 3600,
		minute: 60,
	};

	for (const [unit, seconds] of Object.entries(intervals)) {
		const interval = Math.floor(diffInSeconds / seconds);
		if (interval >= 1) {
			return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
		}
	}

	return 'just now';
}

/**
 * Fetches detailed data for a single featured repository
 */
export async function fetchFeaturedProject(repoName: string): Promise<FeaturedProject | null> {
	try {
		// Fetch main repo data
		const repoResponse = await axios.get(`${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}`, {
			headers: {
				Accept: 'application/vnd.github.v3+json',
				...(import.meta.env.GITHUB_TOKEN && {
					Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}`,
				}),
			},
		});

		// Fetch languages data
		const languagesResponse = await axios.get(`${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/languages`, {
			headers: {
				Accept: 'application/vnd.github.v3+json',
				...(import.meta.env.GITHUB_TOKEN && {
					Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}`,
				}),
			},
		});

		const repo = repoResponse.data;
		const languagesData = languagesResponse.data;

		// Calculate total bytes and language percentages
		const totalBytes = Object.values(languagesData).reduce((sum: number, bytes) => sum + (bytes as number), 0);

		const languages = Object.entries(languagesData)
			.map(([name, bytes]) => ({
				name,
				bytes: bytes as number,
				percentage: ((bytes as number) / totalBytes) * 100,
				color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.Unknown,
			}))
			.sort((a, b) => b.percentage - a.percentage)
			.slice(0, 5); // Top 5 languages

		return {
			name: repo.name,
			description: repo.description || '',
			url: repo.html_url,
			homepage: repo.homepage,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			watchers: repo.watchers_count,
			openIssues: repo.open_issues_count,
			languages,
			lastCommitDate: repo.pushed_at,
			lastCommitDateFormatted: getRelativeTime(repo.pushed_at),
			topics: repo.topics || [],
			primaryLanguage: repo.language || 'Unknown',
		};
	} catch (error) {
		console.error(`Error fetching featured project ${repoName}:`, error);
		return null;
	}
}

/**
 * Fetches all featured projects in parallel
 */
export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
	try {
		const projects = await Promise.all(FEATURED_REPOS.map((repo) => fetchFeaturedProject(repo)));

		// Filter out null results (failed fetches)
		return projects.filter((project): project is FeaturedProject => project !== null);
	} catch (error) {
		console.error('Error fetching featured projects:', error);
		return [];
	}
}
