export const siteMeta = {
	brandShort: 'Imran',
	brandLong: 'Imran',
	siteUrl: 'https://imran.codes',
	logoUrl: 'https://imran.codes/icons/android-chrome-512x512.png',
	ogImage: 'https://imran.codes/og/default.png',
	email: 'mohammedimran86992@gmail.com',
	defaultTitle: 'Imran | Full Stack Developer for Hire in Bangalore | React, TypeScript, Go',
	defaultDescription:
		'Imran is a senior full stack developer for hire in Bangalore/Bengaluru with 5+ years of React, TypeScript, Go, and Rust experience. Available for freelance and contract work.',
	social: {
		twitter: '@imran_vzz',
		twitterUrl: 'https://www.twitter.com/imran_vzz',
		github: 'https://github.com/imran-vz',
		linkedin: 'https://www.linkedin.com/in/m0hammedimran/',
	},
	location: {
		locality: 'Bengaluru',
		region: 'Karnataka',
		country: 'India',
	},
	alternateNames: [
		'Imran',
		'Imran Developer',
		'Imran Go Developer',
		'imran-vz',
		'Bangalore Full Stack Developer',
		'Bengaluru Full Stack Developer',
		'Developer for Hire in Bangalore',
	],
	employer: 'Thoughtseed',
};

/** Build a per-page dot-matrix OG image URL. */
export function ogImageUrl(
	opts: { title?: string; subtitle?: string; variant?: 'default' | 'square' | 'story' } = {},
): string {
	const { title, subtitle, variant = 'default' } = opts;
	const params = new URLSearchParams();
	if (title) params.set('title', title);
	if (subtitle) params.set('subtitle', subtitle);
	const query = params.toString();
	return `${siteMeta.siteUrl}/og/${variant}.png${query ? `?${query}` : ''}`;
}
