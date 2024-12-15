import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import { defineConfig, sharpImageService } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "server",
	image: {
		service: sharpImageService(),
	},
	adapter: vercel({ webAnalytics: { enabled: true } }),
	build: { inlineStylesheets: "always" },
	site: "https://mohammedimran.com",
	integrations: [
		tailwind(),
		sitemap({ changefreq: "always", lastmod: new Date() }),
		mdx({ syntaxHighlight: "shiki" }),
		svelte(),
	],
});
