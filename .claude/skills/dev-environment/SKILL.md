---
name: dev-environment
description: Use when starting local development on pbt-frontend, when the dev server won't respond, when setting up Playwright for live UI testing, or when tsc gives confusingly wrong-looking errors. Covers real, previously-hit environment gotchas -- not generic Next.js advice.
---

# pbt-frontend dev environment

## Before writing any code

Read `AGENTS.md` in this repo first — this Next.js version has real
breaking changes from training-data Next.js. The guide under
`node_modules/next/dist/docs/` is the ground truth for this specific
version, not general Next.js knowledge.

## Starting the server

```
npm run dev   # Next.js dev server (Turbopack), default port 3000
```

Needs the sibling `pbt-enterprise-api` backend running (default port 5000)
for anything beyond static pages — check `NEXT_PUBLIC_API_URL` or
equivalent in `.env.local` for where it's pointed.

## "Server running" but curl/browser gets nothing

Same class of issue as the backend (see the sibling repo's
`dev-environment` skill for the full explanation): a dev server process can
become unreachable from a different shell after a session resume, even
though nothing looks wrong in its own log output. Next.js also sometimes
logs "Port 3000 is in use, using 3001 instead" while actually still bound
to 3000 underneath — don't trust the stated port, verify with a real
`curl` from the shell you're about to test from. If in doubt, kill
whatever's running and start fresh:

```bash
ps aux | grep -i "next dev\|next-server" | grep -v grep
kill -9 <pids>
nohup npm run dev > /tmp/frontend-dev.log 2>&1 &
disown
sleep 8 && curl -s -o /dev/null -w "%{http_code}\n" --max-time 10 http://localhost:3000
```

## Confirm which repo's directory a shell command actually ran in

`cd` inside one Bash tool call does not reliably persist to the next call.
Running `npx tsc --noEmit` right after intending to `cd` here from the
sibling `pbt-enterprise-api` repo (or vice versa) produces a wall of
unrelated pre-existing errors from the *other* repo that looks exactly
like a regression here. Always `pwd` immediately before `tsc`/`npm`/`git`
commands if there's any doubt.

## Live UI testing with Playwright

Chromium is pre-installed — do not run `playwright install`, it isn't
needed and may fail/waste time:

```js
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
```

Write throwaway test scripts as `.mjs` files in the session scratchpad
directory. Log in with a real seeded test account from the backend's
`seed-test-members.ts` (see the sibling repo's `dev-environment` skill for
the current list and shared password) rather than fabricating a session —
this exercises the real login flow, not just the page you actually care
about. Take a screenshot at the key assertion point, not only at the end,
and check `page.on('console', ...)` for JS errors during the flow.

A typecheck/lint pass is not evidence a UI feature works — see this repo's
`AGENTS.md` non-negotiables. A real browser interaction against the
running dev server is the actual bar.
