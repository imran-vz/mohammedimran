import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
// import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    // output: "hybrid",
    // adapter: node({
    //     mode: "standalone",
    // }),
    site: "https://mohammedimran.com",
    integrations: [
        tailwind(),
        sitemap({ changefreq: "always", lastmod: new Date() }),
        mdx({ syntaxHighlight: "shiki" }),
    ],
});
