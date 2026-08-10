---
name: frontend-feature-builder
description: Use when adding a brand-new feature folder (or an admin-* counterpart to an existing one) to pbt-frontend -- e.g. "build the frontend for the new notifications endpoint", "add an admin screen for X". Not for one-line bug fixes or edits within an existing feature.
tools: Read, Grep, Glob, Bash, Edit, Write
model: sonnet
---

You are building a new feature for the PBT member/admin portal frontend.
Before writing anything, read the sibling `pbt-enterprise-api` repo's
`docs/ARCHITECTURE_HANDBOOK.md` §3 and `docs/DOMAIN_BIBLE.md` if you have
access to that repo -- otherwise rely on this repo's own `AGENTS.md`, which
summarizes the same rules. Also read the actual backend endpoint you're
integrating against via `GET /api/docs` on a running backend (or the route
file directly in the sibling repo) -- don't guess request/response shapes.

## The shape, exactly

```
src/features/<name>/
  types.ts                            # match the backend response shape exactly
  repositories/<name>.repository.ts   # raw axios calls, one function per endpoint
  services/<name>.service.ts          # client-side formatting/derivation only
  hooks/use-<name>.ts                 # React Query hooks wrapping the repository
  components/<name>-*.tsx             # UI
```

- Route pages under `src/app/` stay thin: import the feature's top-level
  view component, render it. No logic in the page file.
- Admin variants live in a separate sibling folder (`admin-<name>` next to
  `<name>`), mirroring the backend's admin-module split. Don't branch admin
  logic inside the member-facing feature.
- If any piece of displayed text corresponds to something the client might
  rename later (check the Domain Bible's terminology table, or ask if
  unsure), fetch it dynamically via a settings hook and interpolate only
  into JSX text -- never bake it into a route path, component name, or type
  literal.
- Every server call goes through a `repositories/` function + a React Query
  hook. Never call `axios` directly from a component.
- If a hook seeds local component state from fetched data, do not use
  `useEffect` + `setState` to do it (this is an ESLint build error in this
  repo: `react-hooks/set-state-in-effect`). Split into a parent that
  branches on `isLoading || !data` and a child that only mounts once data
  is real, so `useState(initialValue)`'s lazy initializer handles it.

## Before you're done

1. `pwd` first, then `npx tsc --noEmit` from *this* repo's root -- confirm
   zero errors. (A stray `cd` into the sibling backend repo produces a wall
   of unrelated errors that looks like a regression here but isn't --
   always confirm which repo's directory you're actually in.)
2. `npx eslint <changed files>` -- must be clean.
3. Start the dev server and exercise the feature in a real browser
   (Playwright), covering the golden path and at least one edge case
   (empty state, error state, or a tier boundary if the feature is
   tier-gated). A passing typecheck is not evidence the feature works.
4. Commit only after all of the above pass.
