# Plan 002: Allow crawlers to fetch Astro public assets

Status: TODO. Priority P1. Effort S (under an hour). Risk LOW. Category bug. Dependencies: none.

Planned at `6b2f134`, 2026-09-06, in `/Users/imran/projects/Code/mohammedimran`.

## Drift check

Run `git status --short` and `git diff 6b2f134..HEAD -- public/robots.txt`. Inspect uncommitted changes before editing and preserve user work.

## Why and current state

The homepage loads its timeline script from `/_astro/`. The robots file blocks that directory for general crawlers, Googlebot and Bingbot. Text is server-rendered, but crawlers should also access the assets used to render the page.

`public/robots.txt` has three active user-agent groups, each including:

```text
Allow: /
Content-Signal: ai-train=no, search=yes, ai-input=yes
Disallow: /_astro/
Disallow: /api/
```

It declares `Sitemap: https://imran.codes/sitemap-index.xml`. The general group includes `Crawl-delay: 1`. The optional training-bot blocks at the bottom are comments. The heading “Disallow internal/build directories” incorrectly describes public assets as internal.

## Scope

Only `public/robots.txt`, this plan's verification notes and its index status. Preserve crawler groups, AI preferences, API restrictions, sitemap declaration and other comments. No dependencies, application code or hosting changes.

## Steps

1. Remove all three active `Disallow: /_astro/` lines. Correct the heading to describe the remaining API restriction.
   Verify: `git diff -- public/robots.txt` shows just the three removals and heading correction. `rg -n '^Disallow: /_astro/' public/robots.txt` returns exit 1 with no matches.
2. Run the parser check below, then `vp run build`.
   Verify: parser prints PASS; `cmp public/robots.txt dist/client/robots.txt` exits 0.
3. Run required baseline gates, `git diff --check` and inspect modified files. No new test suite is needed for this static edit.

## Verification

Astro 7.2.4 on Vercel; Node 24, pnpm 11.5.2, Vite+. Work locally on a branch such as `seo/crawler-assets` or a disposable worktree. Run `vp install` as AGENTS.md requests before implementation. Record baseline failures separately, then repeat these commands after the edit:

| Command            | Expected                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `vp check`         | Formatting, lint and types pass without unrelated changes                                               |
| `vp run typecheck` | Astro check exits 0                                                                                     |
| `vp test`          | Tests pass; no project suite currently exists, so report “no test files found” as a baseline limitation |
| `vp run build`     | Build exits 0 into ignored output directories                                                           |

The advisor checked command definitions, not baseline build success. Run `vp env doctor` and report output if setup fails.

```sh
python3 - <<'PY'
from pathlib import Path
from urllib.robotparser import RobotFileParser
text = Path('public/robots.txt').read_text()
r = RobotFileParser()
# Adapt redundant universal Allow and blank lines to this parser's semantics.
r.parse([line for line in text.replace('Allow: /\n', '').splitlines() if line.strip()])
for agent in ('Googlebot', 'Bingbot', 'ExampleCrawler'):
    for path in ('/', '/blog', '/_astro/test.js', '/_astro/test.css', '/_astro/test.webp'):
        assert r.can_fetch(agent, 'https://imran.codes' + path), (agent, path)
    assert not r.can_fetch(agent, 'https://imran.codes/api/example'), agent
assert 'Sitemap: https://imran.codes/sitemap-index.xml' in text
assert text.count('Content-Signal: ai-train=no, search=yes, ai-input=yes') == 3
print('PASS: public assets allowed; API restrictions and stated AI preferences preserved')
PY
```

This checks conventional allow/disallow behavior, not enforcement of Content-Signal by particular crawlers.

## Done and maintenance

All assertions pass, built robots.txt matches source, no source outside scope changed, baseline limitations are recorded, and the index status is updated. Keep future public build assets crawlable. Robots.txt is not access control.

## Stop conditions and boundaries

Stop and report source drift, out-of-scope requirements or verification failures persisting after two focused attempts. Do not edit production, daily preview settings, visible copy or UI. Do not deploy, push or open a PR. If commits are requested, use the repo's simple imperative title convention.

Reference: [Google JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
