import axios from 'axios';

export interface GitHubRepo {
	fork: boolean;
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	stargazers_count: number;
	forks_count: number;
	language: string | null;
	topics: string[];
	created_at: string;
	updated_at: string;
	pushed_at: string;
}

export interface ProcessedRepo {
	name: string;
	description: string;
	url: string;
	homepage: string | null;
	stars: number;
	forks: number;
	language: string;
	topics: string[];
	lastUpdated: string;
	category?: 'personal' | 'oss';
}

const GITHUB_USERNAME = 'imran-vz';
const GITHUB_API = 'https://api.github.com';

/**
 * Fetches user's repositories from GitHub API
 */
export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
	try {
		const response = await axios.get(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos`, {
			params: {
				sort: 'updated',
				per_page: 100,
				type: 'owner',
			},
			headers: {
				Accept: 'application/vnd.github.v3+json',
			},
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching GitHub repos:', error);
		return [];
	}
}

/**
 * Fetches pinned repositories from GitHub GraphQL API
 */
export async function fetchPinnedRepos(): Promise<string[]> {
	const query = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
            }
          }
        }
      }
    }
  `;

	try {
		const response = await axios.post(
			'https://api.github.com/graphql',
			{ query },
			{
				headers: {
					Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN || ''}`,
					'Content-Type': 'application/json',
				},
			},
		);

		const pinnedItems = response.data?.data?.user?.pinnedItems?.nodes || [];
		return pinnedItems.map((item: { name: string }) => item.name);
	} catch (error) {
		console.error('Error fetching pinned repos:', error);
		return [];
	}
}

const PERSONAL_PROJECTS = ['cocoacomaa', 'vegam', 'silver-palm-tree'];
const OSS_CONTRIBUTIONS = ['Dokploy'];

/**
 * Filters and processes repositories for display
 */
export function processRepos(repos: GitHubRepo[]): ProcessedRepo[] {
	// Filter out forks and repos without descriptions
	const filtered = repos.filter(
		(repo) =>
			!repo.fork &&
			repo.description &&
			repo.description.trim() !== '' &&
			!repo.name.includes('test') &&
			!repo.name.includes('demo'),
	);

	// Sort by stars and recent activity
	const sorted = filtered.sort((a, b) => {
		const aScore = a.stargazers_count * 2 + (a.forks_count || 0);
		const bScore = b.stargazers_count * 2 + (b.forks_count || 0);
		return bScore - aScore;
	});

	// Take top 6
	const top = sorted.slice(0, 6);

	// Process for display
	return top.map((repo) => {
		let category: 'personal' | 'oss' | undefined;
		if (PERSONAL_PROJECTS.includes(repo.name)) {
			category = 'personal';
		} else if (OSS_CONTRIBUTIONS.includes(repo.name)) {
			category = 'oss';
		}

		return {
			name: repo.name,
			description: repo.description || '',
			url: repo.html_url,
			homepage: repo.homepage,
			stars: repo.stargazers_count,
			forks: repo.forks_count,
			language: repo.language || 'Unknown',
			topics: repo.topics || [],
			lastUpdated: new Date(repo.pushed_at).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
			}),
			category,
		};
	});
}

/**
 * Main function to get top projects
 */
export async function getTopProjects(): Promise<ProcessedRepo[]> {
	const repos = await fetchGitHubRepos();

	if (repos.length === 0) {
		return [];
	}

	return processRepos(repos);
}
