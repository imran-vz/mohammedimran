import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://mohammedimran.com',
    assets: true,
    integrations: [
        tailwind(),
        sitemap({
            changefreq: 'always',
            lastmod: new Date(),
        }),
        mdx({
            syntaxHighlight: 'shiki',
        }),
    ],
});
