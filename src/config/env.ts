/** Centralized environment variable access. */
export const env = {
	get githubToken(): string | undefined {
		return import.meta.env.GITHUB_TOKEN;
	},
	get githubUsername(): string {
		return (import.meta.env.GITHUB_USERNAME as string) || 'imran-vz';
	},
	get kvRestApiUrl(): string {
		return import.meta.env.KV_REST_API_URL as string;
	},
	get kvRestApiToken(): string {
		return import.meta.env.KV_REST_API_TOKEN as string;
	},
	get cacheInvalidationSecret(): string | undefined {
		return import.meta.env.CACHE_INVALIDATION_SECRET;
	},
};
