import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
    output: "hybrid",
    adapter: vercel(),
    site: "https://mohammedimran.com",
    integrations: [
        tailwind(),
        sitemap({
            changefreq: "always",
            lastmod: new Date(),
        }),
        mdx({ syntaxHighlight: "shiki" }),
        svelte(),
    ],
});
