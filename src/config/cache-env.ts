/** Cache-related environment variable access. */
export const cacheEnv = {
	get kvRestApiUrl(): string {
		return import.meta.env.KV_REST_API_URL as string;
	},
	get kvRestApiToken(): string {
		return import.meta.env.KV_REST_API_TOKEN as string;
	},
	get invalidationSecret(): string | undefined {
		return import.meta.env.CACHE_INVALIDATION_SECRET;
	},
};
