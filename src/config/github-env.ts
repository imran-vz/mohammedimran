/** GitHub-related environment variable access. */
export const githubEnv = {
	get token(): string | undefined {
		return import.meta.env.GITHUB_TOKEN;
	},
	get username(): string {
		return (import.meta.env.GITHUB_USERNAME as string) || 'imran-vz';
	},
};
