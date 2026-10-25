# Local verification

Automated CI is disabled for this project. There are no self-hosted runner
requirements. Run the applicable checks on the device where development happens,
before opening or merging a pull request. Keep the existing checks and tests;
removing CI does not waive verification.

Run from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm run format:check
pnpm run typecheck
pnpm run lint
pnpm run build
```

Use the Node/package-manager versions declared by the repository. These commands validate the static site locally; they do not deploy it.

Record the commands run and their results in the pull request. State any skipped
checks, unavailable fixtures, or untested platforms explicitly.
