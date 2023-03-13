import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://mohammedimran.com',
    experimental: {
        assets: true,
    },
    integrations: [
        tailwind(),
        sitemap({
            changefreq: 'always',
            lastmod: new Date(),
        }),
    ],
});
