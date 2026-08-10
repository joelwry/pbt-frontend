<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Working on `pbt-frontend`

You are one contributor in a long line — human or AI, this session or the
fiftieth. This repo is the member + admin portal for the same product as
`pbt-enterprise-api` (a sibling repo, deployed separately, talked to only
over HTTP). That backend repo's `docs/` folder is the platform's real
source of truth and applies here too, even though it isn't checked into
this repo:

1. **`ENGINEERING_CONSTITUTION.md`** — why PBT exists, product philosophy.
2. **`ARCHITECTURE_HANDBOOK.md`** — how the whole system is built, backend
   *and* frontend (§3 is this repo specifically): feature-folder shape,
   the internal-identifier-vs-display-label pattern, React Query
   conventions, known environment gotchas.
3. **`DOMAIN_BIBLE.md`** — what things mean: tiers, roles, the terminology
   mapping between what a member sees and what the code/API calls it
   (e.g. "Deal Clinic" in the UI is `format: 'Workshop'` in the API).

**Read the Domain Bible before building anything that displays a tier name,
a role, or admin-editable product wording** — the display string and the
internal value are frequently different on purpose, and get more different
over time as the client renames things.

## Non-negotiables

- **Follow the feature-folder shape exactly**: `types.ts →
  repositories/ → services/ → hooks/ → components/` under
  `src/features/<name>/`. Admin variants are separate sibling folders
  (`admin-pricing` next to `pricing`), not a branch inside the member one.
- **When a product name is (or might become) admin-editable, only the
  rendered text changes.** Route paths, component names, and internal type
  literals stay exactly as they are — fetch the label via a hook
  (`useSiteSettings()` is the existing pattern) and interpolate it only
  into JSX text. Do not rename the underlying identifier just because the
  displayed name changed.
- **Never call `setState` synchronously inside a `useEffect`** to sync
  fetched data into local edit state — this is an ESLint build error
  (`react-hooks/set-state-in-effect`), not a style nit. Split the component
  so the form only mounts once real data exists instead (see Architecture
  Handbook §3.4 for the exact pattern with a worked example).
- **Every server request goes through a `repositories/` function and a
  React Query hook in `hooks/`.** Don't call `axios` directly from a
  component.
- **Before considering any UI feature done**: start the dev server and
  exercise the actual feature in a real browser (Playwright), covering the
  golden path and at least one edge case (empty state, error state, or the
  gated/ungated tier boundary if the feature is tier-aware). Passing
  `tsc`/lint is necessary but is not evidence the feature works.
- **Run `npx tsc --noEmit` from *this* repo's directory before every
  commit**, and confirm with `pwd` first — a stale shell `cd` into the
  sibling backend repo produces a wall of unrelated errors that looks like
  a regression here but isn't (a real, repeated gotcha worth checking for
  explicitly, not just assuming won't happen).
