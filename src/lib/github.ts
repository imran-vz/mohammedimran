import axios from 'axios';
import { githubEnv } from '../config/github-env';
import { LANGUAGE_COLORS } from '../config/language-colors';
import type { Data, Errors, Response } from '../types';
import CustomError from '../utils/CustomError';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_GRAPHQL_URL = `${GITHUB_API_URL}/graphql`;
const GITHUB_API_VERSION = '2022-11-28';
const MAX_GRAPHQL_ERROR_MESSAGE_LENGTH = 90;

const USER_REPOSITORY_LANGUAGES_QUERY = `query userInfo($login: String!) {
    user(login: $login) {
        repositories(
            ownerAffiliations: OWNER
            isFork: false
            first: 100
            privacy: PUBLIC
            orderBy: {
            direction: DESC
            field: UPDATED_AT
            }
        ) {
            nodes {
                name
                description
                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                    edges {
                        size
                        node {
                            color
                            name
                        }
                    }
                }
            }
        }
    }
}`;

export interface GitHubRepositoryLanguage {
	name: string;
	percentage: number;
	bytes: number;
	color: string;
}

export interface GitHubRepositoryDetails {
	name: string;
	description: string;
	url: string;
	homepage: string | null;
	stars: number;
	forks: number;
	watchers: number;
	openIssues: number;
	languages: GitHubRepositoryLanguage[];
	lastCommitDate: string;
	topics: string[];
	primaryLanguage: string;
}

type GitHubUserRepositoryLanguages = { data: Data };

interface GitHubRestRepositoryResponse {
	name: string;
	description: string | null;
	html_url: string;
	homepage: string | null;
	stargazers_count: number;
	forks_count: number;
	watchers_count: number;
	open_issues_count: number;
	pushed_at: string;
	topics?: string[];
	language: string | null;
}

type GitHubRepositoryLanguagesResponse = Record<string, number>;

function authorizationHeader(token = githubEnv.token): Record<string, string> {
	return token ? { Authorization: `Bearer ${token}` } : {};
}

function restHeaders(token?: string): Record<string, string> {
	return {
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': GITHUB_API_VERSION,
		...authorizationHeader(token),
	};
}

function graphqlHeaders(token?: string): Record<string, string> {
	return {
		Accept: 'application/vnd.github+json',
		...authorizationHeader(token),
	};
}

function isGitHubGraphQLErrorResponse(input: unknown): input is { errors: Errors } {
	return input != null && typeof input === 'object' && 'errors' in input;
}

function truncateErrorMessage(message: string, maxLength = MAX_GRAPHQL_ERROR_MESSAGE_LENGTH): string {
	if (message.length <= maxLength) return message;
	return `${message.slice(0, maxLength - 3)}...`;
}

function firstGraphQLError(errors: Errors) {
	return errors[0];
}

function customErrorMessage(message: string | undefined, fallbackMessage: string): string {
	return message || fallbackMessage;
}

function graphQLErrorType(type: string | undefined, statusText?: string): string {
	const errorTypes: Record<string, string> = {
		NOT_FOUND: CustomError.USER_NOT_FOUND,
	};

	return (type && errorTypes[type]) || statusText || CustomError.GRAPHQL_ERROR;
}

function graphQLErrorMessage(type: string | undefined, message: string | undefined): string {
	const fallbackMessage =
		type === 'NOT_FOUND'
			? 'Could not fetch user.'
			: 'Something went wrong while trying to retrieve the language data using the GraphQL API.';

	return message ? truncateErrorMessage(message) : fallbackMessage;
}

function graphQLErrorFrom(errors: Errors, statusText?: string): CustomError {
	const error = firstGraphQLError(errors);
	return new CustomError(graphQLErrorMessage(error?.type, error?.message), graphQLErrorType(error?.type, statusText));
}

function isObjectWithMessage(input: unknown): input is { message: unknown } {
	return typeof input === 'object' && input != null && 'message' in input;
}

function axiosErrorMessage(error: unknown): string {
	if (!axios.isAxiosError(error)) return '';

	const responseData = error.response?.data;
	return isObjectWithMessage(responseData) ? String(responseData.message) : error.message;
}

function axiosErrorType(error: unknown): string | undefined {
	return axios.isAxiosError(error) ? error.response?.statusText : undefined;
}

function mappedAxiosError(error: unknown, fallbackMessage: string, fallbackType: string): CustomError {
	return new CustomError(
		customErrorMessage(axiosErrorMessage(error), fallbackMessage),
		customErrorMessage(axiosErrorType(error), fallbackType),
	);
}

function mappedNativeError(error: Error, fallbackType: string): CustomError {
	return new CustomError(error.message, fallbackType);
}

function mapGitHubError(error: unknown, fallbackMessage: string, fallbackType: string): CustomError {
	if (error instanceof CustomError) return error;
	if (axios.isAxiosError(error)) return mappedAxiosError(error, fallbackMessage, fallbackType);
	if (error instanceof Error) return mappedNativeError(error, fallbackType);

	return new CustomError(fallbackMessage, fallbackType);
}

function toRepositoryLanguages(languagesData: GitHubRepositoryLanguagesResponse): GitHubRepositoryLanguage[] {
	const totalBytes = Object.values(languagesData).reduce((sum, bytes) => sum + bytes, 0);
	if (totalBytes === 0) return [];

	return Object.entries(languagesData)
		.map(([name, bytes]) => ({
			name,
			bytes,
			percentage: (bytes / totalBytes) * 100,
			color: LANGUAGE_COLORS[name] || LANGUAGE_COLORS.Unknown,
		}))
		.sort((a, b) => b.percentage - a.percentage)
		.slice(0, 5);
}

function toRepositoryDetails(
	repo: GitHubRestRepositoryResponse,
	languagesData: GitHubRepositoryLanguagesResponse,
): GitHubRepositoryDetails {
	return {
		name: repo.name,
		description: repo.description || '',
		url: repo.html_url,
		homepage: repo.homepage,
		stars: repo.stargazers_count,
		forks: repo.forks_count,
		watchers: repo.watchers_count,
		openIssues: repo.open_issues_count,
		languages: toRepositoryLanguages(languagesData),
		lastCommitDate: repo.pushed_at,
		topics: repo.topics || [],
		primaryLanguage: repo.language || 'Unknown',
	};
}

async function fetchRepositoryDetail(
	owner: string,
	repoName: string,
	token?: string,
): Promise<GitHubRepositoryDetails> {
	const headers = restHeaders(token);
	const [repoResponse, languagesResponse] = await Promise.all([
		axios.get<GitHubRestRepositoryResponse>(`${GITHUB_API_URL}/repos/${owner}/${repoName}`, { headers }),
		axios.get<GitHubRepositoryLanguagesResponse>(`${GITHUB_API_URL}/repos/${owner}/${repoName}/languages`, { headers }),
	]);

	return toRepositoryDetails(repoResponse.data, languagesResponse.data);
}

export interface GitHubAdapter {
	fetchUserRepositoryLanguages(username: string, token?: string): Promise<GitHubUserRepositoryLanguages>;
	fetchRepositoryDetails(owner: string, repoNames: string[], token?: string): Promise<GitHubRepositoryDetails[]>;
}

export const githubAdapter: GitHubAdapter = {
	async fetchUserRepositoryLanguages(username, token) {
		try {
			const response = await axios<Response>({
				url: GITHUB_GRAPHQL_URL,
				method: 'POST',
				data: { query: USER_REPOSITORY_LANGUAGES_QUERY, variables: { login: username } },
				headers: graphqlHeaders(token),
			});

			if (isGitHubGraphQLErrorResponse(response.data)) {
				throw graphQLErrorFrom(response.data.errors, response.statusText);
			}

			return response.data;
		} catch (error) {
			throw mapGitHubError(
				error,
				'Something went wrong while trying to retrieve the language data using the GraphQL API.',
				CustomError.GRAPHQL_ERROR,
			);
		}
	},

	async fetchRepositoryDetails(owner, repoNames, token) {
		const results = await Promise.allSettled(
			repoNames.map((repoName) =>
				fetchRepositoryDetail(owner, repoName, token).catch((error) => {
					throw mapGitHubError(
						error,
						`Something went wrong while trying to retrieve GitHub repository data for ${repoName}.`,
						CustomError.GITHUB_REST_API_ERROR,
					);
				}),
			),
		);

		return results.flatMap((result, index) => {
			if (result.status === 'fulfilled') return [result.value];

			console.error(`Error fetching GitHub repository ${repoNames[index]}:`, result.reason);
			return [];
		});
	},
};
