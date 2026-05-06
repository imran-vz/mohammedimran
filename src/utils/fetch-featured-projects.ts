import { env } from '../config/env';
import { githubAdapter } from '../lib/github';

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

const FEATURED_REPOS = ['seer', 'cocoacomaa', 'gosqlit'];

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
		const [repo] = await githubAdapter.fetchRepositoryDetails(env.githubUsername, [repoName]);
		if (!repo) return null;

		return {
			name: repo.name,
			description: repo.description,
			url: repo.url,
			homepage: repo.homepage,
			stars: repo.stars,
			forks: repo.forks,
			watchers: repo.watchers,
			openIssues: repo.openIssues,
			languages: repo.languages,
			lastCommitDate: repo.lastCommitDate,
			lastCommitDateFormatted: getRelativeTime(repo.lastCommitDate),
			topics: repo.topics,
			primaryLanguage: repo.primaryLanguage,
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
		const projects = await githubAdapter.fetchRepositoryDetails(env.githubUsername, FEATURED_REPOS);

		return projects.map((project) => ({
			...project,
			lastCommitDateFormatted: getRelativeTime(project.lastCommitDate),
		}));
	} catch (error) {
		console.error('Error fetching featured projects:', error);
		return [];
	}
}
