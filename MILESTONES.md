# PBT Portal Revamp — Milestones

**Branch:** `claude/pbt-portal-revamp` (both repos)
**Started:** 26 October 2026
**Approach:** extend the existing frontend (435 files / ~25k lines / 38 features / 56 routes,
Stripe wired end to end) rather than rebuild. Nothing working gets thrown away.

Status key: `TODO` · `IN PROGRESS` · `DONE` · `BLOCKED`

---

## How this is sequenced, and why

Two things are missing that would normally drive a build: the client's designs
(pending) and most of her source documents (only folder `08. PBT PATHWAY` was
shared — the curriculum, calculators and workbooks are in folders we don't have).

So the order below front-loads work that is **safe against both unknowns**:

1. A **token-based design system** first. When the designs land, a restyle is a
   token swap plus component tweaks, not a rewrite. Building features on top of
   ad-hoc styling would mean redoing them twice.
2. Then the features that are **fully specified by documents we actually hold** —
   the Power Team checklist is complete enough to build from today.
3. Then the features specified only by the **Gemini summary** (calculators, the
   wealth planner). These get built to the summary and flagged for verification
   against the real documents when they arrive.
4. Billing/entitlement alignment last, because four details in the client's own
   spreadsheet contradict each other (see Blocked).

---

## M0 — Design foundation `DONE`

No new features. Everything after this inherits it.

- [x] Design tokens: colour ramps, elevation/shadow scale, radii, spacing, type scale
- [ ] Light + dark — **deferred**, see note below
- [x] Core primitives restyled: Card, Button, Badge, Input, Select, Dialog, Table, Skeleton, Toast
- [x] App shell: sidebar, topbar, page header, content surfaces
- [x] Layered backgrounds and soft elevation — the "modern, good background / box shadow" ask
- [ ] Responsive pass at phone width (M1)

**Done when:** every existing page picks up the new look with no layout breakage,
before/after screenshots captured.

**Shipped:**
- Layered elevation scale (`--pbt-elev-xs…xl`) tinted with the brand navy instead of
  pure black, each level carrying a hairline ring. Repointed the three old shadow
  token names at the new values, so all ~435 files picked up the refresh with no
  component edits.
- Page background is no longer a flat `#f5f8fa` — two very low-alpha brand radials
  (sky top-left, orange bottom-right), fixed to the viewport.
- Card hairlines moved from a real border into the shadow ring, so edges recede and
  don't cost a layout pixel.
- New surface tokens (sunken / base / raised / muted), `pbt-card-muted` for nested
  panels, `pbt-glass` for sticky headers.
- Buttons: top-light gradient plus a glow in the button's own hue, physical press
  on `:active`.
- One global `:focus-visible` ring — several primitives previously had none at all,
  a real keyboard-accessibility gap.
- `prefers-reduced-motion` honoured on card lift/transition.

**Deferred:** dark mode. It doubles the QA surface across 56 routes and the client's
designs aren't in yet — cheap to add later since everything is already tokenised,
expensive to redo if her palette contradicts it. Say the word if you want it now.

---

## M1 — Member journey restyle + known UI defects `IN PROGRESS`

Applies M0 across the member portal, and clears the UI issues the client already
reported in `feature2fix.md` and `docs/ui_adjustment.md` — none of which have been
actioned yet.

- [ ] Dashboard, PBT Pathway, Resources, Events, Community Group, PBT Plus, Masterplan
- [x] **Donut/progress chart rebuilt** — now a real segmented doughnut (Completed /
      In Progress / Upcoming) using the same shared `DonutChart` the admin dashboards
      use, which is exactly what the client asked for. Root cause of the label
      collision found and fixed in the shared component: the whole SVG was rotated
      −90° and each `<text>` counter-rotated about *its own* bounding box rather than
      the ring's centre. That bug was live on the admin dashboard and analytics pages
      too, so fixing it there fixed all three at once. Added a neutral track ring so
      an empty chart still reads as a doughnut, plus an `aria-label`.
- [ ] **Summary cards below the page banner** implemented across the six member pages
      that are missing them (`ProgrammeSummaryCard` and siblings)
- [ ] **Roadmap year selector**: show current year and 1–2 years *back*, with a dropdown —
      currently shows future years (2027) which don't exist yet
- [ ] **Session persistence**: refreshing the browser currently logs the member out —
      a leftover from the dummy-data prototype, wrong now that auth is real
- [ ] **Password show/hide toggle** on login
- [ ] Pagination on lesson lists

**Done when:** walkthrough video of the member journey across all three tiers.

---

## M2 — Power Team expansion `TODO`

The one feature fully specified by a document we hold (`Power Team Checklist`, 27 sections).
Current schema has **5** categories; the client defines **21** specialists.

- [ ] Backend: widen the category enum 5 → 21, migration for existing partners
- [ ] Three team compositions: Core, Development, Business Owner
- [ ] Per-specialist detail: what they do, what good looks like, questions to ask, when to engage, red flags
- [ ] Member UI: browse by specialist, filter by composition
- [ ] Admin: manage the expanded taxonomy
- [ ] Keep the existing Plus+ tier gate (confirmed correct against the client's matrix)

---

## M3 — Deal tools `TODO`

- [ ] BRRR calculator — ~17 inputs, ~8 derived outputs, live recalculation
- [ ] 10-step BTL deal analysis framework
- [ ] Save/recall a member's own deals

⚠ Built from the Gemini summary, not the source spreadsheet. Formulas must be
verified against the client's real calculator before this goes near a member.

---

## M4 — Property Wealth Planner `TODO`

- [ ] 10-question diagnostic, capital-band → strategy routing
- [ ] Personalised strategy report output
- [ ] Public/pre-auth entry point (it's lead generation, so it has to work before signup)

⚠ Same caveat as M3 — summary-derived.

---

## M5 — Entitlements & billing alignment `BLOCKED`

- [ ] Encode the client's tier matrix exactly (Pathway / Plus / Masterplan)
- [ ] Standalone products: 2-day location mentorship, crash course, extra course
- [ ] Contract minimums
- [ ] Stripe verification pass (checkout, webhook, cancellation)

Blocked on the four contradictions below.

---

## M6 — QA pass + walkthrough `TODO`

- [ ] All three member tiers + all five admin roles exercised in a real browser
- [ ] Screenshots per milestone
- [ ] Recorded video walkthrough

---

## Blocked — needs the client

From `Product Breakdown - 2026 (TO BE REVIEWED).xlsx`:

1. **1-2-1 frequency contradicts itself.** "Monthly 1hr 1-2-1" *and* "Bi-Monthly 1hr 1-2-1"
   are both TRUE for both Plus and Masterplan. Can't be both.
2. **Duplicated networking row** — "selected networking events (Limited for Pathway)" and
   "selected networking events" are both TRUE/TRUE/TRUE. One presumably meant to limit Pathway.
3. **£495 attribution.** Reads as "Extra Course → £495"; the summary attached it to the
   3-month crash course instead.
4. **Pathway contract length.** Her sheet says minimum 3 months; the live app says
   "No contract · weekly release".

Also outstanding: the client's designs, and Drive access to the curriculum,
calculator and workbook folders.
