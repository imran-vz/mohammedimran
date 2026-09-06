# Plan 001: Include every article in the sitemap and exclude the preview page

Status: DONE. Priority P1. Effort S (hours). Risk LOW. Category bug. Dependencies: none.

Implemented on 2026-09-06 in `seo/sitemaps`.

- Added a prerendered XML endpoint using collection IDs and XML-escaped absolute article URLs, without modification dates.
- Registered the blog sitemap alongside the existing child sitemap and excluded the exact preview pathname, preserving hire URLs.
- Baseline and final `vp check`, `vp run typecheck`, and `vp run build` passed. Astro check retained 27 existing hints. `vp test` exited 1 because no test files exist, both before and after implementation.
- The XML build assertion passed with 10 unique content URLs. The static sitemap was copied to `.vercel/output/static`; blog detail routes still target `_render` and have no static output.
- The build reports a nonfatal warning because existing middleware reads request headers during sitemap prerendering. The XML endpoint does not read request headers; middleware remains unchanged as required by scope.

Planned at `6b2f134`, 2026-09-06, in `/Users/imran/projects/Code/mohammedimran`.

## Drift check

Run `git status --short` and `git diff 6b2f134..HEAD -- astro.config.ts src/content.config.ts src/pages/blog src/pages/og-preview.astro src/middleware.ts`. Inspect uncommitted changes too. Reconcile drift before editing; do not overwrite user work.

## Why and current state

The live sitemap has nine entries: eight content pages and `/og-preview/`, which returns 404. Both published articles are missing. Blog links still make articles discoverable; this fix completes sitemap discovery.

`astro.config.ts:15` currently contains:

```ts
sitemap({
    changefreq: 'always',
    customPages: hirePages.map((page) => `https://imran.codes/hire/${page.slug}`),
    lastmod: new Date(),
}),
```

`src/content.config.ts` loads `**/*.md` under `src/content/blog`. The blog index uses `getCollection('blog')` and `post.id` for links. Use those authoritative collection IDs, not an independent filename parser. Blog detail pages use `getEntry` at request time, and middleware negotiates `text/markdown`; keep those pages server-rendered.

`src/pages/og-preview.astro:7` returns 404 when `import.meta.env.PROD` is true. The sitemap integration cannot infer that behavior. Installed `@astrojs/sitemap/dist/index.js` supports both `filter` and `customSitemaps`.

## Scope and conventions

Modify `astro.config.ts`; create `src/pages/sitemap-blog.xml.ts`. Documentation updates are limited to this plan and its index status. Do not edit content, layouts, blog routes, middleware, robots, dates, dependencies or hosting settings.

Astro 7.2.4, Vercel adapter 11.0.7, TypeScript, Node 24, Vite+ and pnpm 11.5.2. Match tabs, single quotes and inferred types; no `any`. Use the blog index's `getCollection('blog')` pattern and `siteMeta.siteUrl` from `src/config/siteMeta.ts`.

## Steps

1. Create a prerendered XML endpoint at `src/pages/sitemap-blog.xml.ts`. Export `prerender = true` and a typed Astro GET handler. Read the collection and return a standard sitemap `urlset`, with one absolute `/blog/${post.id}` URL per post and `Content-Type: application/xml; charset=utf-8`. XML-escape URL text, including ampersands. Do not invent modification dates. An empty collection must yield a valid empty urlset.
   Verify: `vp run typecheck` succeeds; `vp run build` emits `dist/client/sitemap-blog.xml`.
2. Add `customSitemaps: ['https://imran.codes/sitemap-blog.xml']` to the existing sitemap integration. Filter out the exact preview pathname after stripping trailing slashes. Preserve all custom hire URLs. Do not put the XML endpoint in the page URL list.
   Verify: rebuild, then run the XML assertion below. The index references both child files, with 10 unique content URLs total and no preview page.
3. Run the baseline gates below again, `git diff --check`, and inspect source scope. Confirm the new XML endpoint is static in Vercel output and blog detail routes remain server-rendered.

## Verification commands

Work on a local branch or disposable worktree. Run `vp install` before implementation as AGENTS.md requests. Record baseline results before changing source.

| Command            | Expected                                                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `vp check`         | Format, lint and type checks pass; do not broadly fix unrelated files                                                 |
| `vp run typecheck` | Astro check exits 0                                                                                                   |
| `vp test`          | Tests pass; this checkout has no project suite, so “no test files found” is a baseline limitation, not a passing test |
| `vp run build`     | Astro build exits 0 and writes ignored dist/ and .vercel/output/                                                      |

These commands were identified from package.json and vp help; the advisor did not execute baseline builds. If environment setup fails, run `vp env doctor` and report the output.

After the build:

```sh
python3 - <<'PY'
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET
root = Path('dist/client')
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
index = ET.parse(root / 'sitemap-index.xml')
files = [urlparse(x.text).path.lstrip('/') for x in index.findall('.//s:loc', ns)]
assert 'sitemap-blog.xml' in files, files
urls = [x.text for f in files for x in ET.parse(root / f).findall('.//s:loc', ns)]
paths = [urlparse(u).path.rstrip('/') or '/' for u in urls]
expected = {'/', '/blog', '/hire', '/skills',
 '/hire/developer-for-hire-bangalore', '/hire/react-developer-bengaluru',
 '/hire/golang-developer', '/hire/typescript-developer',
 '/blog/how-to-build-terminal-ui-with-go-and-bubbletea',
 '/blog/how-to-get-started-with-tauri-for-cross-platform-desktop-apps'}
assert set(paths) == expected, paths
assert len(paths) == len(set(paths)) == 10, paths
assert all(urlparse(u).scheme == 'https' and urlparse(u).netloc == 'imran.codes' for u in urls)
print('PASS: 10 unique content URLs across the sitemap index')
PY
```

Use this one-time build-output check instead of adding a test framework. Reconcile expected article names if the collection changed after planning.

## Done and maintenance

- XML assertions pass; every article appears once; no preview URL.
- Blog runtime and Markdown negotiation are unchanged.
- Required checks pass or pre-existing limitations are explicitly reported.
- Only scoped source files changed; update this plan's status in plans/README.md.

Future articles enter the sitemap on build automatically. Revisit static sitemap generation if a runtime CMS is introduced. Plan 003 normalizes the original sitemap's trailing slashes. Build-based lastmod is a separate deferred finding.

## Stop conditions and Git workflow

Stop and report if source drift invalidates assumptions, an out-of-scope file or dependency is needed, or verification fails twice after a focused correction. Never deploy or edit live settings to obtain validation. No UI edits, push or PR. Use a local branch such as `seo/sitemaps`; if commits are requested, match the repo's simple imperative titles.

References: [Astro sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/), [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
