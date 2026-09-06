import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';
import { defineConfig, sharpImageService } from 'astro/config';
import { hirePages } from './src/data/hire-pages';

// https://astro.build/config
export default defineConfig({
	output: 'server',
	image: { service: sharpImageService() },
	adapter: vercel(),
	build: { inlineStylesheets: 'always' },
	site: 'https://imran.codes',
	integrations: [
		sitemap({
			changefreq: 'always',
			customPages: hirePages.map((page) => `https://imran.codes/hire/${page.slug}`),
			customSitemaps: ['https://imran.codes/sitemap-blog.xml'],
			filter: (page) => new URL(page).pathname.replace(/\/+$/, '') !== '/og-preview',
			lastmod: new Date(),
			serialize: (item) => {
				const url = new URL(item.url);
				url.pathname = url.pathname.replace(/\/+$/, '') || '/';
				return { ...item, url: url.href };
			},
		}),
		svelte(),
	],
});
