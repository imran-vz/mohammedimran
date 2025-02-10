import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, sharpImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	image: {
		service: sharpImageService(),
	},
	adapter: vercel({ webAnalytics: { enabled: true } }),
	build: { inlineStylesheets: 'always' },
	site: 'https://mohammedimran.com',
	vite: {
		plugins: [(() => tailwindcss() as any)()],
	},
	integrations: [sitemap({ changefreq: 'always', lastmod: new Date() }), mdx({ syntaxHighlight: 'shiki' }), svelte()],
});
