# SEO implementation plans

Prepared 2026-09-06 against commit `6b2f134`. Implemented locally using separate worktrees and subagents. Production is unchanged.

[Original planning overview](seo-plan.html). This archived overview preserves the pre-implementation handoffs; current status and verification are recorded here and in each plan.

| Plan                                                   | Priority | Effort | Risk   | Depends on | Status |
| ------------------------------------------------------ | -------- | ------ | ------ | ---------- | ------ |
| [001: Complete sitemaps](001-complete-sitemaps.md)     | P1       | S      | Low    | None       | DONE   |
| [002: Allow public assets](002-allow-public-assets.md) | P1       | S      | Low    | None       | DONE   |
| [003: Canonical URLs](003-canonical-urls.md)           | P1       | S      | Medium | 001        | DONE   |

Plans 001 and 002 ran in parallel with separate file ownership. Plan 003 started after both were merged into the integration branch, preserving serial ownership of `astro.config.ts`.

Each plan records implementation evidence and baseline limitations. The original baseline built and typechecked successfully, with 27 Astro hints; no test files existed. Formatting issues in the supplied plans were corrected before implementation.

## Integration verification (2026-09-06)

- Final integration build and Astro typecheck pass; all 41 redirect boundary tests pass.
- Combined output assertions confirm 10 unique canonical content URLs, crawlable public assets, unchanged API restrictions and AI preferences, static blog sitemap output, and public pages routed through SSR.
- Isolated HTTP verification confirms bodyless GET/HEAD redirects, query preservation, canonical metadata, Markdown responses and missing-article 404s. The temporary server was stopped.
- The 27 existing Astro hints remain. The new static sitemap also exposes a nonfatal warning from existing middleware reading request headers during prerendering; generated XML is verified.
- All implementation branches are integrated locally. No push or deployment occurred; hosted routing validation remains pending deployment.

## Deferred findings

Build timestamps in sitemap lastmod, contribution API caching, missing blog icons, hiring-page H1s, Person alternateName cleanup, homepage positioning and case studies were not selected.

## Considered and rejected

- Prerendering blog pages just for sitemap discovery could bypass runtime Markdown negotiation. Generate a separate static XML sitemap instead.
- Hardcoding article URLs would omit future posts again.
- Global trailing-slash or host redirects unnecessarily affect OAuth, MCP and agent endpoints. Limit redirects to public GET/HEAD page routes.
- Sitemap omission does not prove non-indexing: articles are internally linked.
- Ranking or performance scores cannot be inferred without search and field-performance data.

No deployment, production mutation, push, PR or public issue is part of these plans. If a PR is requested later, rebase onto latest main first.
