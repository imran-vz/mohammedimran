# Plan 003: Give each public content page one canonical URL

Status: DONE. Priority P1. Effort S (hours). Risk MEDIUM (routing). Category bug. Dependency: Plan 001 for the final sitemap structure.

Implemented on 2026-09-06 in `seo/canonical-urls`, after Plans 001 and 002.

- Added a pure public-content redirect helper and an early bodyless 308 response, preserving the remaining Markdown middleware exactly. Only GET/HEAD public page families normalize slashes and the exact www hostname; other origins and query parameters are preserved.
- Normalized the shared blog canonical URL and sitemap item paths. Plan 001's filter and blog sitemap registration remain intact; no global trailing-slash configuration changed.
- `vp install`, baseline/final `vp check`, `vp run typecheck`, and `vp run build` passed. Astro check retained 27 existing hints and the build retained the known sitemap prerender middleware warning. Baseline `vp test` had no test files; final full and focused test runs passed all 41 boundary cases using the verified `vite-plus/test` export. `git diff --check` passed.
- Build XML assertions passed: exactly 10 expected, unique HTTPS content URLs, with no non-root trailing slashes. Generated Vercel routes send every affected page and slash alias to `_render`; no static page output bypasses middleware, and the server entry imports the generated middleware containing the redirect branch.
- Isolated HTTP checks on port 4381 passed: GET and HEAD return bodyless 308 redirects; local origin and query survive; both article variants emit the same production canonical without the query; Markdown returns 200 with article content, `Vary: Accept`, and token count; a missing article alias ends in 404.
- The browser verified the article redirect, canonical metadata, visible article/home content, and no console errors. The `agent-browser` CLI was unavailable, so browser verification used CUA. The verification tab was closed and the worktree's dev server was stopped; port 4381 is free.
- No deployment or live setting changes performed. Hosted redirect behavior still requires separately authorized deployment validation.

Planned at `6b2f134`, 2026-09-06, in `/Users/imran/projects/Code/mohammedimran`.

## Drift check

Run `git status --short` and `git diff 6b2f134..HEAD -- astro.config.ts src/layouts/BlogPost.astro src/middleware.ts`. Preserve Plan 001's expected config additions. Reconcile other drift before editing, including uncommitted work.

## Why and current state

Blog URLs with and without a trailing slash return 200 and claim themselves canonical. The sitemap lists `/blog/`, `/hire/`, `/skills/`, while those pages canonicalize without slashes. www also serves duplicate content, although its canonical metadata already points to the main hostname.

Target: HTTPS imran.codes; `/` for home; no trailing slash on other public pages; preserve queries through redirects but omit them from canonical metadata.

`src/layouts/BlogPost.astro:23`:

```ts
const canonicalUrl = `${siteMeta.siteUrl}${Astro.url.pathname}`;
```

`src/middleware.ts:72`:

```ts
export const onRequest = defineMiddleware(async ({ request }, next) => {
    if (!acceptsMarkdown(request.headers.get('Accept'))) {
        return next();
    }
```

The remaining middleware negotiates Markdown and must retain its behavior. Navigation already uses slash-free paths. astro.config.ts has no global trailingSlash policy. The installed Astro trailing-slash handler also redirects non-GET requests; avoid changing OAuth, MCP and agent route behavior with a global setting.

## Scope and conventions

Modify `astro.config.ts`, `src/layouts/BlogPost.astro`, `src/middleware.ts`. Create `src/lib/canonical.ts` and `src/lib/canonical.test.ts` for a small pure redirect-decision helper and meaningful route-boundary tests. Documentation changes: this plan and index status.

Do not modify vercel.json, live domain configuration, authentication endpoints, page content, sitemap dates or other schemas. Astro 7.2.4, Vercel adapter 11.0.7, Node 24, pnpm 11.5.2, TypeScript and Vite+. Match tabs, single quotes and inferred types. No `any`, module mocks or new dependencies. Use the typed URL/request APIs already used in middleware.

## Steps

1. Add a pure helper taking a URL and method and returning a redirect URL or null. Only process GET/HEAD for `/`, `/blog`, `/blog/<one slug>`, `/hire`, `/hire/<one slug>` and `/skills`, allowing trailing slashes on input. Match the parsed pathname, not substrings. Strip trailing slashes except for root. For the literal hostname `www.imran.codes`, switch to HTTPS imran.codes with no port. Preserve all other origins, including localhost and private previews. Preserve the query. Return null for canonical inputs, excluded routes and non-read methods. Do not mutate the input URL.
   Call this helper at the start of onRequest, before Markdown negotiation. Return a bodyless 308 with Location when a redirect is needed; leave the remainder untouched.
   Verify: focused tests below pass; `vp run typecheck` succeeds; the middleware diff has only an import and early redirect branch.
2. Normalize `Astro.url.pathname` before composing canonicalUrl in BlogPost: strip trailing slashes, retaining `/` for root. Keep `siteMeta.siteUrl` as the trusted origin. Existing canonical, Open Graph, article and breadcrumb consumers must all keep using this same value.
   Verify: local requests to both article variants resolve to the same slash-free path and emit the same production canonical without query parameters.
3. Add a sitemap serialize callback in astro.config.ts, returning each item with its URL pathname normalized while preserving root and all other properties. Preserve Plan 001's filter and customSitemaps; its blog sitemap already emits slash-free URLs. Do not change global Astro/Vercel trailingSlash settings.
   Verify: `vp run build`, then Plan 001's XML assertions and the supplementary slash assertion below.
4. Run baseline gates, inspect `git diff --check` and `.vercel/output/config.json`. Confirm affected public SSR routes still pass through middleware. If an affected page bypasses middleware, stop and report instead of changing live domains. Local tests do not establish hosted routing; report deployment validation as pending separate authorization.

## Focused tests and commands

Use the Vitest API exported by the installed Vite+ package; confirm the exact import export locally before writing the test. No existing project suite provides a pattern. Table-driven tests of the pure helper must cover:

- Slash normalization for each listed page family and both article/service slug paths.
- Canonical paths and non-www root return null.
- www plus trailing slash and `?ref=portfolio` becomes HTTPS non-www with query intact in one hop.
- Localhost and private preview hosts remain unchanged when paths normalize.
- POST, PUT, DELETE and OPTIONS return null.
- `/oauth/token/`, `/oauth/authorize/`, `/mcp/`, `/agent/register/`, `/_astro/a.js`, `/.well-known/openapi.json`, `/robots.txt`, `/sitemap-blog.xml` are excluded.
- Running the helper again on its result returns null, preventing loops; input URL stays unchanged.

`vp test src/lib/canonical.test.ts` must pass. These tests protect consequential redirect boundaries, not implementation snapshots.

Work on a local branch such as `seo/canonical-urls` or a disposable worktree. Before editing, run `vp install`, `vp check`, `vp run typecheck`, `vp test`, `vp run build` and record baseline failures. Repeat after edits: all must succeed, with pre-existing limitations reported separately. The original checkout has no project tests; this plan introduces focused tests. The advisor identified commands but did not run baseline builds. Use `vp env doctor` for setup failures. Build output must stay in ignored directories.

After the build:

```sh
python3 - <<'PY'
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET
root = Path('dist/client')
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
files = [urlparse(x.text).path.lstrip('/') for x in ET.parse(root / 'sitemap-index.xml').findall('.//s:loc', ns)]
urls = [x.text for f in files for x in ET.parse(root / f).findall('.//s:loc', ns)]
assert len(urls) == len(set(urls)) == 10, urls
assert all(urlparse(u).path == '/' or not urlparse(u).path.endswith('/') for u in urls)
print('PASS: sitemap URLs follow the canonical slash policy')
PY
```

Check port 4381 is free, then start `vp run dev --host 127.0.0.1 --port 4381` in the isolated checkout. Do not reuse a daily preview server. Run:

```sh
curl -sS -D - -o /dev/null 'http://127.0.0.1:4381/blog/?ref=portfolio'
curl -sS -I 'http://127.0.0.1:4381/hire/golang-developer/'
curl -sS -L 'http://127.0.0.1:4381/blog/how-to-build-terminal-ui-with-go-and-bubbletea/?ref=portfolio'
curl -sS -L -H 'Accept: text/markdown' 'http://127.0.0.1:4381/blog/how-to-build-terminal-ui-with-go-and-bubbletea/'
```

First two: 308 to the same local origin without trailing slashes, preserving ref in the first. Third: slash-free production canonical without ref. Fourth: Markdown article response. A missing blog slug must still end in 404, never a successful homepage. Do not invoke mutating API endpoints to test exclusions; pure tests cover their redirect decisions. Stop only the local server you started.

## Done and maintenance

Route-boundary tests pass; public aliases normalize once; sitemap and metadata agree; Markdown still works; no new redirect behavior for excluded routes; generated routing reviewed; no deployment performed. Update the index status and record verification limitations.

New public page families require deliberate inclusion in the helper and tests. Moving pages from SSR to prerendering requires revisiting redirect ownership. Use one shared decision helper rather than duplicating host/path logic.

## Stop conditions and Git workflow

Stop on unexpected source drift, out-of-scope requirements, or verification that fails twice after focused correction. No UI/copy changes, production mutations, push or PR. If commits are requested, use simple imperative titles consistent with the repo; rebase onto main before a requested PR.

References: [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), installed Astro `dist/core/routing/trailing-slash-handler.js`, installed sitemap `dist/index.js`.
