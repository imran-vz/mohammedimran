import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';

// https://astro.build/config
export default defineConfig({
    site: 'https://mohammedimran.com',
    integrations: [
        tailwind(),
        sitemap({
            changefreq: 'always',
            lastmod: new Date(),
        }),
        image(),
    ],
});
