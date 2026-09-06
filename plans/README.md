# SEO implementation plans

Prepared 2026-09-06 against commit `6b2f134`. These are implementation handoffs, not completed fixes. Source code and production are unchanged.

[Visual overview](seo-plan.html)

| Plan                                                   | Priority | Effort | Risk   | Depends on | Status |
| ------------------------------------------------------ | -------- | ------ | ------ | ---------- | ------ |
| [001: Complete sitemaps](001-complete-sitemaps.md)     | P1       | S      | Low    | None       | TODO   |
| [002: Allow public assets](002-allow-public-assets.md) | P1       | S      | Low    | None       | TODO   |
| [003: Canonical URLs](003-canonical-urls.md)           | P1       | S      | Medium | 001        | TODO   |

Execute serially. Plans 001 and 003 share astro.config.ts; do not assign simultaneous ownership. Plan 002 is independent but small enough for the same pass.

Each plan includes scope, evidence, verification and stop conditions. The advisor inspected command definitions and installed framework code; installation, fresh builds and baseline tests were not run. Executors must record existing failures separately.

## Deferred findings

Build timestamps in sitemap lastmod, contribution API caching, missing blog icons, hiring-page H1s, Person alternateName cleanup, homepage positioning and case studies were not selected.

## Considered and rejected

- Prerendering blog pages just for sitemap discovery could bypass runtime Markdown negotiation. Generate a separate static XML sitemap instead.
- Hardcoding article URLs would omit future posts again.
- Global trailing-slash or host redirects unnecessarily affect OAuth, MCP and agent endpoints. Limit redirects to public GET/HEAD page routes.
- Sitemap omission does not prove non-indexing: articles are internally linked.
- Ranking or performance scores cannot be inferred without search and field-performance data.

No deployment, production mutation, push, PR or public issue is part of these plans. If a PR is requested later, rebase onto latest main first.
