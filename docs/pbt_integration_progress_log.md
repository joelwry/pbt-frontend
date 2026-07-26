# PBT Frontend ↔ Backend Integration — Progress Log

This is a running, chronological record of what has actually been built, fixed, and verified across both repos (`pbt-enterprise-api` and `pbt-frontend`). Use it to know what's safe to report as "done," what's intentionally deferred, and why. It lives identically in both repos so whichever one you open, you get the full picture — pull the other repo's copy if you want to confirm they match.

**Branches**
- Backend: `claude/pbt-phase3-mobile-frontend-g0a4tw` (re-pointed onto the real prior work — see "Branch history note" below)
- Frontend: `claude/pbt-phase3-mobile-frontend-g0a4tw` (same)

**Test accounts** (seeded locally for this session's testing — see "Environment used for this session's testing" below for why, and what you need to do to get equivalent accounts on your own database):
- `testuser1@example.com` / `password123` — Plus subscription, member role.
- `admintest@example.com` / `password123` — `admin` role, promoted via a one-off script.

Seeding (subscription, roadmap content, admin role) was done with throwaway scripts, not committed to either repo — matches the project's existing convention.

---

## Phase 1 — Foundation (Auth)

### Goal
Wire real login/register/refresh/logout/session-restore between the two apps, per the hybrid auth strategy: `rememberMe: false` sessions hold tokens in memory only; `rememberMe: true` sessions rely on an httpOnly refresh cookie and silently restore on page load.

### Backend changes

**Auth-specific (planned work):**
- Added `cookie-parser`; `/auth/refresh-token` now falls back to reading the refresh token from the httpOnly cookie when the request body has none, and rotates that cookie on successful refresh. This is what makes persistent sessions work.
- `refreshTokenSchema` made the body field optional to support the cookie-only case.

**Pre-existing bugs found and fixed** (none of this was working before — the server could not even boot). Found by getting `npm run dev` to actually start and fixing whatever it crashed on, one layer at a time:
- `ENABLE_HELMET` was read from config but never defined — added.
- `logger` was imported as a named import (`{ logger }`) against a default export in **9 files** across core middleware and several services — fixed everywhere.
- A stray space in a method name (`getReceived Introduction`) in `introduction.service.ts` was silently swallowing *all* other TypeScript diagnostics behind a fatal parse error — fixing it is what let the rest of these problems surface at all.
- `ZodError.errors` doesn't exist in the installed Zod v4 (renamed to `.issues`) — fixed in `errorHandler.ts` and `ValidationMiddleware.ts`. Before this fix, every validation failure returned a 500 instead of a proper 400.
- `@types/express` was pinned to v5 while the actual `express` package is v4 — downgraded `@types/express` to v4 to match. This alone fixed a large batch of cascading type errors (`req.id`, `res.end` overrides, handler return types).
- `securityMiddleware.ts`: added a proper `Express.Request` type augmentation for the correlation-id (`req.id`) and rate-limit (`req.rateLimit`) fields; fixed two handlers whose explicit `: void` return type conflicted with `return res.status(...).json(...)`.
- `health.routes.ts`: fixed the same logger-import bug, a type-narrowing bug that made `'error'` un-assignable to a `'ok' | 'error'` field, and two calls to `ResponseHandler` methods (`sendError`, `sendSuccess`) that don't exist — mapped to the real methods (`notFound`, `ok`).
- **Mongoose v9 middleware signature mismatch** — the installed mongoose version's `pre()` hooks no longer use the old `(next) => { ...; next(); }` callback style; they're return/Promise-based now (`(this, opts?) => void | Promise<void>`). This broke the soft-delete `pre(/^find/, ...)` hook in **10 schema files** (Community, Event, Leader, Learning ×3, Membership, PowerTeam, Programme, Resource, Subscription, User) plus the password-hashing `pre('save', ...)` hook in `User.schema.ts`. Rewrote all of them to the new signature.
- `JwtHelper.ts`: `jwt.sign()`'s `expiresIn` option needs a type assertion against the installed `jsonwebtoken` types — fixed for both access and refresh token generation.
- `auth.service.ts`: the `AuthService` constructor had a parameter named `authRepository` whose *default value* referenced `authRepository` — i.e. the import was shadowed by its own parameter, causing a "cannot access before initialization" crash on every request. This meant **auth had never actually worked at runtime**, even before any of the type issues. Fixed by aliasing the import.
- **Wrong auth-middleware import names**, three different typos across route files, all fixed to the real export `authenticate`:
  - `authMiddleware` (should be `authenticate`) — 10 route files (subscriptions, activity, community, dashboard, introductions, mentorship, opportunities, questions, recommendations, stories).
  - `protect` (should be `authenticate`) — 3 route files (bookmarks, journeys, progress).
- **`req.user.id` doesn't exist** — the JWT payload only has `.userId`. An explicit-typed usage in `introduction.controller.ts` caught this at compile time; but the same bug existed silently (via `(req as any).user?.id`, which bypasses type-checking) in 7 more controllers (activity, dashboard, mentor, opportunities, questions, recommendations, stories) and in `subscription.controller.ts` (caught later, in Phase 2, when it silently broke `GET /subscriptions/current`). All fixed to `.userId`.
- `dashboard.service.ts`: `dashboard.populate([...]).save()` chained `.save()` directly onto the Promise returned by `.populate()` instead of awaiting it first — fixed.
- `recommendation.service.ts`, `power-team.controller.ts`: query filters passing a plain `string` where the schema expects a narrower literal-union type — cast at the call site.
- `MemberIntroduction.schema.ts`: added a missing `connectedAt` field the service was already trying to set.
- **Community feature deliberately disabled** (`app.ts` — route import and registration both commented out with an explanatory note). `community.controller.ts` assumes a data model (`thread.replies` as a subdocument array, `thread.likes` as an array of user IDs for toggle-tracking) that doesn't match `Community.schema.ts` (which only has `comments` and a plain numeric `likes` counter). This is a real product/design decision, not a typo — deferred to Phase 5. **Still deferred** as of this log entry — nobody has touched Community yet.

### Frontend changes
- `src/lib/access-token-store.ts` (new): a tiny module-level store so `apiClient`'s request interceptor can attach the current access token to every request, since the token lives in React state inside `AuthProvider` but the axios instance is created outside React.
- `api-client.ts`: added the request interceptor above.
- `features/auth/repositories/auth.repository.ts`: swapped every method from mock/localStorage-token logic to real `apiClient` calls against `/auth/login`, `/auth/refresh-token`, `/auth/me`, `/auth/logout`. Added `restoreSession()` for the cookie-based silent-refresh-on-boot flow.
- `features/auth/types.ts`: `AuthSession.refreshToken` and `RefreshedSession.refreshToken` made optional — persistent sessions never hold a refresh token in JS memory at all (only the httpOnly cookie carries it).
- `providers/auth-provider.tsx`: rewritten to track session mode (`"memory" | "persistent"`), attempt `restoreSession()` on mount, and expose a real `isLoading` (previously hardcoded `false`).
- `components/layout/require-auth.tsx`: now waits for `isLoading` before redirecting to `/login` — previously it would bounce a persistent session to the login page on every reload, before the silent refresh had a chance to run.
- `.env.local` / `.env.example` (new): `NEXT_PUBLIC_API_BASE_URL`.

### Verified (live, via curl and real browser)
- Register → real user created in MongoDB.
- Login with `rememberMe: false` → tokens returned in body, no cookie set.
- Login with `rememberMe: true` → httpOnly `refreshToken` cookie set.
- `/auth/refresh-token` via cookie only (no body) → new access token issued, cookie rotated.
- `/auth/refresh-token` with neither cookie nor body → clean 401, not a crash.
- `/auth/me` with a valid bearer token.
- Logout → cookie cleared.
- **Full browser login flow**: filled the real login form, submitted, landed on the correct page, session persisted across a full page reload for a `rememberMe: true` login.

### Known gaps, left open on purpose
- Registration does **not** auto-provision a `Membership` or `Subscription` record — matches the product's real intent ("membership access is set up after you subscribe on our main site"). A fresh account is correctly treated as having no active subscription, not silently given one.
- Community routes disabled (see above) — Phase 5.

---

## Phase 2 — Frontend ↔ Backend Integration (Dashboard, Profile, Subscription Status)

### Key decision made this phase
The backend has **two separate, easy-to-confuse concepts**:
- `/memberships/*` — content-access construct (tier + `accessibleYears`, i.e. which programme-years you can view). No billing fields.
- `/subscriptions/*` — the actual billing construct (tier, `status` including a real `'expired'` value, `billingCycle`, `amount`, `currency`, `endDate`).

Phase 1 wired `CurrentMember`'s tier/status fields to `/memberships/current`. On inspecting how the frontend's own "My Subscription" page consumes `CurrentMember` (it builds the whole page from it, no separate subscription fetch), it became clear `/subscriptions/current` is the correct source — matching status values and carrying the billing data that page actually needs. **Switched.** `/memberships/current` is reserved for Phase 3 (content-year access checks).

### Backend changes
- `subscription.controller.ts`: fixed the `req.user.id` → `.userId` bug (see Phase 1 notes) — this was silently returning "no subscription" for every real user until fixed.
- `User.schema.ts`: added `location`, `investmentFocus`, `assignedLeader` (read-only, admin/mentor-assigned — not part of the member's own update payload), and a `notificationPreferences` sub-document (`communityReplies`, `eventReminders`, `newModuleReleases`, `marketingUpdates`).
- New endpoints: `PATCH /auth/me` (update profile details, resets `emailVerified: false` if the email changes) and `PATCH /auth/me/notifications` (update one preference at a time).
- `Learning.schema.ts`: added a missing `timeSpentMinutes` field to `UserLessonProgress` — needed for real study-hours aggregation and simply hadn't been added. (It sat unused, always 0, until this session's Phase 3 continuation — see below.)
- **`dashboard.service.ts` rewritten from scratch.** The previous `DashboardData` model was a near-empty stub (just unpopulated ObjectId references, no stats/progress logic at all — nothing the frontend's rich dashboard could render from). It now genuinely aggregates: lessons completed (+ weekly delta), study hours (+ weekly delta), content-unlocked counts, next-unlock lookup, programme-progress percentages, the most recent in-progress lesson, upcoming events (from the real `Event` model), and a lightweight community-activity feed (from `Community.schema.ts` directly — reading only, not touching the disabled controller).

### Frontend changes
- `auth.repository.ts`: `composeMember()` now calls `/subscriptions/current` instead of `/memberships/current`, with tier-casing (`plus` → `Plus`) and status mapping.
- `dashboard.repository.ts`: swapped from `dashboardMock` to `GET /dashboard`.
- `profile.repository.ts`: swapped from an in-memory mock store to `GET /auth/me`, `PATCH /auth/me`, `PATCH /auth/me/notifications`.

### Verified (live, real browser)
- Login with the seeded account → routes straight to the dashboard (not the renew-subscription screen), confirming subscription-status gating works against real data.
- Dashboard renders correctly with a mix of real data and honest empty states.
- Profile page shows the real member; edited and persisted the Location field and a notification toggle, both confirmed via a fresh `GET /auth/me`.
- My Subscription page shows "PBT Plus," "Your membership is active," and the exact `endDate` from the seeded subscription.

### Known gaps, left open on purpose
- Billing history / invoices / payment method still on mocks — Phase 4 (Billing & Stripe) work.
- Dashboard's `quickAccess` tiles are a small hardcoded constant in the backend service (they never vary per member) — not a gap, just worth knowing it's not "real" aggregated data.

---

## Phase 3 — Learning System (Business Learning Journey)

### Goal
Replace the academic-flavoured Year/Programme/Module/Lesson model with the product's real hierarchy — Roadmap → Roadmap Week → Module → Lesson — per `pbt_phase3_intgration_guide.md`. Reconcile the two progress-tracking models into a clean architecture. Enforce both access gates (membership tier, time release) server-side. Ship the admin API to manage this content. Establish a swappable storage abstraction. Align terminology throughout.

### Backend — new domain model
- **`Roadmap.schema.ts`** (new) — top-level container, one per cohort year (`title`, `year`, `description`, `isCurrent`). Replaces the never-used `Programme.schema.ts`, which was deleted.
- **`RoadmapWeek.schema.ts`** (new) — time-boxed section of a Roadmap (`roadmapId`, `weekNumber`, `title`, `description`).
- **`Learning.schema.ts`** — `Module.programYear: string` replaced with `Module.roadmapWeekId: ObjectId` (ref `RoadmapWeek`). `Lesson` unchanged at the time — it already had `access.unlocksAt` / `access.requiredTier`.
- **`UserProgress.schema.ts`** rewritten per the guide's "Progress Architecture": one document per member, aggregate-only fields (`completedLessonsCount`, `completedModulesCount`, `overallProgress`, `streakDays`, `totalLearningMinutes`, `currentRoadmapId/WeekId/ModuleId/LessonId`).
- **`learning-progress.service.ts`** (new) — the Learning Progress Service. `recalculate(userId)` is the *only* place `UserProgress` is ever written, always triggered by a `UserLessonProgress` change.
- **Old `progress` module reconciled, not deleted.** `Milestone.schema.ts`'s `programmeId` field renamed to `roadmapId`.
- **Access control fixed to use the right source.** Added `subscriptionService.canAccessTier(userId, requiredTier)` and switched the lesson-access check to use it (per the Phase 2 decision that Subscription is canonical). *(Superseded for the general Roadmap this session — see "Phase 3 continued" below: the tier gate was removed from My Learning per a later product decision.)*
- **Real bug found and fixed: `getModuleProgress` divided by the wrong denominator.** Fixed to use `Lesson.countDocuments({ moduleId })`.
- New endpoints, all under `/api/v1/learning`: `GET /years`, `GET /roadmap/:year`, `GET /weeks/:weekId`, `GET /modules/:moduleId`, `GET /lessons/:lessonId`, `POST /lessons/:lessonId/progress`, `GET /continue`.
- **Real bug found and fixed: `GET /lessons/:lessonId` returned the raw Mongoose document (`_id`)** instead of the mapped `id` field every other learning endpoint uses — this is what broke the frontend's "Mark as Complete" button (`POST /learning/lessons/undefined/progress`).

### Backend — admin API (new module: `admin-learning`)
Full CRUD for the hierarchy at `/api/v1/admin/learning/*`, gated by `authorize('admin', 'super_admin')`: Roadmaps, Roadmap Weeks, Modules, Lessons (list/create/update/delete, scoped appropriately), asset upload.

This was the API half of "admin ships alongside member work." **The admin-content frontend wiring was the open item at the end of this phase** — see "Phase 3 continued" below for how that closed out.

### Backend — storage abstraction (new: `src/core/storage`)
- `StorageProvider` interface (`upload(file, folder) → { url, storageKey }`, `delete(storageKey)`).
- `LocalStorageProvider` — writes to `/uploads` (gitignored), served statically at `/uploads/*`. Active by default.
- `CloudinaryStorageProvider` — real Cloudinary SDK integration, selected via `STORAGE_PROVIDER=cloudinary`.
- Neither is imported directly by application code — only `storageProvider` from `src/core/storage/index.ts`. **Confirmed still true this session** — see "Storage / Cloudinary" below.

### Frontend
- Terminology aligned throughout: `ProgrammeSummaryCard` → `RoadmapSummaryCard`, `programmeProgress` → `roadmapProgress`, page copy updated ("Your growth roadmap, at your own pace...").
- `learning.repository.ts` rewritten from mocks to real endpoints.
- New types: `RoadmapWeekSummary`, `Roadmap`.
- `my-learning-view.tsx` restructured for the Week grouping level; "Continue Where You Left Off" split into its own hook.
- **Real gap found and fixed: "Mark as Complete" was never wired to the API at all** — pure local `useState`. Wired via `useCompleteLesson()`.

### Test data (Phase 1–3, prior session)
Seeded via throwaway script: one Roadmap (2026), two Roadmap Weeks, two Modules, four Lessons — including one deliberately gated behind Mentorship tier (this gate was later removed for My Learning — see below) and one deliberately future-dated. `admintest@example.com` promoted to `admin`.

### Verified (live, curl + real browser, prior session)
Full walkthrough confirmed: roadmap/week/module data, tier gate (at the time), time gate, progress recalculation, `/continue`, dashboard's `roadmapProgress` field, admin CRUD + role-gating (403 for `member` role), file upload, and end-to-end "Mark as Complete" → roadmap/module/Continue-Learning all updating from one write.

### Known gaps at the end of this phase (as originally logged — see "Phase 3 continued" for what closed)
- **Admin frontend UI not wired** — `admin-content` feature still on mocks.
- `Membership` model effectively bypassed for lesson-gating (Subscription + `unlocksAt` do that job) — not deleted, not a decided-on retirement either.
- Milestones/rewards (`Milestone.schema.ts`) remain unused by any frontend.

---

## Cross-cutting bug patterns found in Phases 1–3 (for awareness)

| Pattern | Files affected | Root cause |
|---|---|---|
| `import { logger }` vs default export | 9 | Import style didn't match `logger.ts`'s actual export |
| Mongoose `pre()` callback-style hooks | 11 | Written for an older Mongoose API; installed version (v9) is Promise/return-based |
| `ResponseHandler.success(res, data, message)` argument order | 13 controllers | Didn't match the real `(res, statusCode, message, data)` signature |
| `AppError('message', code, ...)` argument order | 7 files | Didn't match the real `(statusCode, message, errors[])` signature |
| Wrong auth-middleware import name (`authMiddleware`, `protect`) | 13 route files | Real export is `authenticate` |
| `req.user.id` instead of `.userId` | 9 controllers | JWT payload only has `.userId`; several instances hidden behind `as any` casts |
| `Schema.Types.ObjectId` used as a TS *type* (not schema value) | 14 schema files | Classic Mongoose+TS pitfall — should be `Types.ObjectId` |

None of these were introduced by the integration work — all were pre-existing and fixed as part of getting the backend to actually compile and run.

---

## Phase 3 continued — Admin Portal Integration & Live-Tested Bug Fixes

*(This session. Scope: close the admin-content gap flagged at the end of Phase 3, fix every item in `docs/ui_adjustment.md`, and follow up on what that work exposed.)*

### Branch history note
This session's designated branch (`claude/pbt-phase3-mobile-frontend-g0a4tw`) started with **zero commits diverged from `main`** in both repos — the prior session's real work lived on `claude-pbt-backend-integration` / `claude-pbt-frontend-integration`, which hadn't been fetched into this session's initial clone. Re-pointed the designated branch onto the tip of those integration branches before doing anything else (confirmed safe: the designated branch had nothing unique to lose).

### Real admin auth (a hard prerequisite that turned out to be missing)
Discovered `admin-auth.repository.ts` / `AdminAuthProvider` were **100% mock** — fake JWT-shaped tokens signed with `alg: none`, a hardcoded in-memory admin directory, no session-restore, no `isLoading`. This made the admin-content wiring below untestable as a real flow, so it had to be fixed first:
- The backend has no separate `/admin/auth/*` namespace — admin sign-in reuses the same `/auth/login` as members; role (`admin`/`super_admin`) is what gates admin-portal access, enforced for real by `authorize('admin', 'super_admin')` on every `/admin/*` backend route. The frontend's role check is a UX nicety on top of that, not the security boundary.
- New `src/lib/admin-access-token-store.ts` and `src/lib/admin-api-client.ts` — a fully separate token store and axios instance from the member `apiClient`. Necessary because `AdminAuthProvider` and the member `AuthProvider` are **both mounted simultaneously** whenever any `/admin/*` page renders (root layout wraps everything in the member `AuthProvider`; the admin layout nests `AdminAuthProvider` inside that) — sharing one token store would let an admin and member session clobber each other's Authorization header within the same tab.
- `admin-auth-provider.tsx` rewritten with the same hybrid session-mode pattern as the member provider (`"memory" | "persistent"`, `restoreSession()` on mount, real `isLoading`), and `RequireAdminAuth` updated to wait on it before redirecting.
- Added `"Admin"` to the `AdminRole` union for the backend's plain `admin` role (backend doesn't have granular per-admin section permissions yet, so it's granted every section — the real gate is still the backend role check). This required small additive fixes in `admin-users` (the still-mocked "Invite Admin User" feature) so its role picker and `Record<AdminRole, ...>` maps stayed exhaustive.
- `DemoAdminAccountsPanel` updated to reference the real seeded `admintest@example.com` account instead of fictional mock credentials.

### admin-content wired to the real `/admin/learning/*` API
- Field mapping between the editor's UI-shaped `AdminLesson` and the backend `Lesson` document: `Download` (UI) ↔ `PDF` (backend) lesson type; `visibility` (`all`/`plus-mentorship`/`mentorship`) ↔ `requiredTier` (`Pathway`/`Plus`/`Mentorship`) — a lossless 1:1 mapping thanks to the tier hierarchy; `durationLabel` ↔ `metaLabel`; `description` ↔ `body.summary`; `status` (`Published`/`Scheduled`/`Draft`) computed from `unlocksAt` vs now, or `isDraft` (new field, see below).
- **New backend additions this session** (all in `admin-learning`, needed to make the already-built list/search/paginate UI functional against real data):
  - `GET /admin/learning/lessons` — flat, paginated, searchable lesson list across every roadmap (joined with module/week/roadmap context for display labels).
  - `GET /admin/learning/lessons/stats` — the Content Management stats row (excludes drafts).
  - `GET /admin/learning/lessons/:lessonId` — single lesson with joined context, for the edit form.
  - `updateLesson` extended to support moving a lesson to a different module (re-parents both sides of `Module.lessons[]`).
  - `createLesson` defaults `category` (from the module's own title) and auto-increments the legacy `month` ordering field, and `author` now defaults to `"PBT Team"` at the schema level — none of these are collected by the existing editor form, and the schema previously required them.
- **New `Lesson.isDraft` field** — the editor's "Save as Draft" button was always real UI, wired to nothing. Added the field, and every member-facing query (`getModuleLessons`, `getLesson`, `getContinueWhereLeftOff`, the dashboard aggregate, `learning-progress.service.ts`'s counts) now excludes drafts.
- Cascading Roadmap-year → Module select in the editor replaces the hardcoded `MODULE_OPTIONS`/`YEAR_OPTIONS` constants, fed from new `getModuleOptions()` / `getRoadmapYears()` aggregations (admins see every year, including future ones — they need to pre-build next year's content).
- File upload dropzone (previously decorative — picked a file, stored nothing) now actually calls the asset-upload endpoint after save.

### `docs/ui_adjustment.md` — all six items, each confirmed in a real browser
1. **Dashboard donut chart overlap** — `roadmap-progress-card.tsx`'s `ProgressRing`: only the arc rotates now (via a `<g>` around its own center), and both text labels use fixed pixel offsets from center instead of being counter-rotated around the wrong pivot. Applied the identical fix to `roadmap-summary-card.tsx` (My Learning's own ring), which had the same latent bug — not visibly colliding at its smaller size, but the same wrong-pivot math.
2. **My Learning year picker** — real `<select>` dropdown (was a row of pill buttons), and `learning.service.ts#getRoadmapYears()` now filters to the current year and up to two years back, server-side — never a future year, regardless of what roadmaps exist (an admin can pre-create next year's roadmap without members seeing it early).
3. **Refresh logs a member out** — root cause: `rememberMe` defaulted to `false` on the login form, so unless someone explicitly checked it, the session was legitimately memory-only by the existing (correct) hybrid design and couldn't survive a reload. Changed the default to `true` on both the member and admin login forms — the checkbox still works as an explicit opt-out. Also gave the admin side real session-restore (it had none at all before — see above).
4. **Password visibility toggle** — added to both login forms (member and admin).
5. **Lesson tier-gating in My Learning** — per the doc ("including a higher level subscription package lesson into the module is wrong... all lesson shown are mostly lessons for all subscription level"): `canAccessLesson` now checks only the Release Gate (`unlocksAt`); the Membership Gate no longer applies to My Learning. `requiredTier` is still stored per-lesson and settable by admins — it's reserved for the dedicated PBT Plus / PBT Mentorship areas, which are separate from the general roadmap. Mirrored the same change client-side in `access-control.ts` (defense-in-depth only; the backend is the real gate). Pagination on module lesson lists already existed client-side (4 per page) from the prior session, matching the "modules are small" design note — confirmed still working, not a regression.
6. **`timeSpentMinutes` always 0** — `updateLessonProgress` (service, controller, and the frontend's `completeLesson` call) now accepts a `timeSpentMinutes` increment and accumulates it onto `UserLessonProgress.timeSpentMinutes` (not overwritten — a lesson is often revisited before completion). `lesson-detail-view.tsx` measures actual time-on-page and sends it on "Mark as Complete." `learning-progress.service.ts` already summed this into `UserProgress.totalLearningMinutes` correctly — that half was never broken, just never fed real data.

### Real bugs found via live testing (these would not have surfaced from a code review or `tsc`)
Testing was done against a genuinely running MongoDB + Express + Next.js stack (see "Environment used for this session's testing" below) — register/login via curl, full CRUD via curl and a real headless-browser session, screenshots inspected. Three real, previously-invisible bugs surfaced this way:

1. **Dashboard aggregate leaking draft lessons.** `dashboard.service.ts` has its own separate `Lesson.find({})` (predates `isDraft`, which didn't exist until this session) — `contentUnlocked`/`contentUnlockedTotal`/`nextUnlockLabel`/`roadmapProgress` were all counting (and could have displayed the title of) a draft lesson. Fixed by adding the same `isDraft` exclusion used everywhere else.
2. **`countDocuments()` silently bypassing soft-delete.** The existing soft-delete middleware (`schema.pre(/^find/, ...)`) matches Mongoose operation names starting with `"find"` — but `countDocuments`'s operation name is exactly `"countDocuments"`, which the regex never matched. Every `Lesson`/`Module`/`UserLessonProgress` count driving module/roadmap progress percentages, the new admin stats endpoint, and pagination totals was including soft-deleted documents. Caught concretely: created, moved, then deleted a lesson through the admin API; the flat lesson list correctly excluded it (uses `find()`), but its pagination `totalItems` (via `countDocuments()`) still counted it — 5 vs the real 4. Fixed by widening the hook to `/^find|^countDocuments/` on all three schemas in `Learning.schema.ts`. **This same gap likely exists in the other ~10 schema files that use the identical soft-delete pattern** (Community, Event, Leader, Membership, PowerTeam, Resource, Subscription, User) — out of this session's scope to touch, but worth a dedicated audit pass since it's the same one-line fix everywhere.
3. **Tailwind v4 gradient rename breaking 16 files, plus a deeper cascade bug underneath.** `bg-gradient-to-*` was renamed to `bg-linear-to-*` in Tailwind v4 (this project's installed version); the old class name silently generates no CSS at all, leaving every gradient background in the app unstyled. Renamed across all 16 affected files (sidebars, both login pages, several feature cards). Doing that exposed the real, deeper bug: `.pbt-card` in `globals.css` set `background: var(--pbt-card)` — the **shorthand** — which implicitly resets `background-image` to `none`, and since it's unlayered custom CSS it wins the cascade over any `@layer utilities` gradient class a caller adds via `className`. So *any* `<Card>` with a gradient override (e.g. `RoadmapSummaryCard`, `ContinueLearningCard`, `LessonCard`) was rendering as a plain white box with invisible white-on-white text, **independent of which gradient class name was in use** — the rename alone would not have fixed it. Fixed by changing `.pbt-card` to `background-color` instead of the shorthand. Confirmed via `getComputedStyle(...).backgroundImage` before/after, not just visual inspection, since the bug is easy to misdiagnose as "wrong class name" when it's actually a cascade/specificity issue.

### Follow-up: admin Roadmap/Week/Module management UI
Flagged as a gap immediately after the admin-content wiring above: a lesson attaches to an existing module, but nothing let an admin create the Roadmap → Week → Module hierarchy itself for a brand-new year without calling the backend API directly (the admin-content feature, as originally scaffolded, only ever had a Lesson list + editor — no roadmap-structure screen).

- New route `/admin/content/roadmaps` ("Manage Roadmap Structure," linked from Content Management's header): an accordion of Roadmaps → Weeks → Modules, each level with its own create/edit/delete via a Dialog form.
- This is entirely frontend work — every backend endpoint it calls (roadmap/week/module CRUD under `/admin/learning/*`) already existed and was already tested in the original Phase 3 admin API pass.
- The lesson editor's Module select now links to this page when the chosen year has no modules yet, instead of a dead-end disabled option.
- Verified live: created a brand-new 2028 roadmap → week → module purely through this UI, confirmed it immediately appeared in the lesson editor's cascading select, then verified delete at all three levels (module, week, roadmap).

### Storage / Cloudinary — already done, confirmed this session, no code changes needed
Checked because it came up as a forward-looking question: is switching from local disk storage to Cloudinary (or any other media host, for video/PDF/template/image uploads) really "one line," or does it need rewiring?

**It's already exactly that.** `src/core/storage/index.ts` picks `LocalStorageProvider` or `CloudinaryStorageProvider` purely from the `STORAGE_PROVIDER` env var; `CloudinaryStorageProvider.ts` is a complete, real implementation against the `cloudinary` SDK (`upload_stream` + `destroy`), not a stub — confirmed by reading it in full, and confirmed the `cloudinary` npm package (`^2.10.0`) is an actual installed dependency, not just imported and unused. No application code anywhere imports a concrete provider directly, only the `storageProvider` export. **To go live with Cloudinary: set `STORAGE_PROVIDER=cloudinary` plus `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` in `.env`. Zero code changes.** If a different media host is ever wanted instead, the only work is a new class implementing the two-method `StorageProvider` interface (`upload`, `delete`) and one more `case` in that same switch statement.

### Environment used for this session's testing
This sandbox's network policy blocks direct TCP to `*.mongodb.net` (confirmed even after widening Atlas's IP allowlist and the environment's own network policy — the policy change didn't apply retroactively to an already-running session container). Rather than fake or skip live testing, downloaded a real `mongod` binary (fastdl.mongodb.org was reachable) and ran an actual local MongoDB instance for this session — same Mongoose code path as production, genuinely exercised, not mocked. **Nothing in the shipped code depends on this** — point your own `MONGODB_URI` (Atlas or otherwise) at `.env` as normal. The `.env` file itself is gitignored and was never committed.

### Verified this session (live, curl + real headless-browser screenshots)
- Full register/login/role-promotion flow for both a member and an admin test account.
- `GET /learning/years` correctly excludes a seeded future-year roadmap for a member, while `GET /admin/learning/roadmaps` correctly includes it for an admin.
- Module lesson list: a deliberately Mentorship-tagged lesson is fully open to a Plus-tier member (tier gate removed); a future-dated lesson correctly locked; a draft lesson invisible everywhere, including denominators used for progress percentages.
- `POST /lessons/:id/progress` with `timeSpentMinutes` → `UserProgress.totalLearningMinutes` increments correctly.
- Admin CRUD via curl and via the real UI: create/get/update (including cross-module move)/delete a lesson; role-gate correctly 403s a member token; file upload against the local storage provider.
- Real browser: member login → dashboard (donut chart rendering correctly) → refresh (session persists) → My Learning (year dropdown, lesson lock states, gradient roadmap summary card) → lesson detail → "Mark as Complete" → completion + time tracked. Admin login → dashboard → refresh (persists) → Content Management (real stats, real paginated list) → Add Lesson (cascading selects) → created lesson appears → Edit (prefilled correctly) → Delete (confirmed gone). Roadmap Structure page → created/deleted a full Roadmap → Week → Module chain.
- A member account attempting `/admin/login` is correctly rejected and stays on the admin login page.

### Known gaps and honest limitations (carried forward or newly identified)
- **Article and Quiz lesson content authoring** — the editor's file-upload flow only really serves Video and PDF/Download lesson types (upload a file, get a URL, store it). Article lessons need rich-text/HTML content and Quiz lessons need a question builder; neither has an editor UI yet. Left alone deliberately rather than inventing a rich-text editor or quiz builder outside this session's requested scope — worth scoping as a dedicated follow-up if Article/Quiz content is needed soon.
- **`countDocuments()` soft-delete gap likely exists in ~10 other schema files** beyond the three fixed in `Learning.schema.ts` this session (see bug #2 above) — same one-line fix, different files, not yet audited.
- Community feature still disabled from Phase 1 — untouched this session, still Phase 5 as originally scoped.
- Phase 4 (Billing & Stripe) and everything after it in `pbt_roadmap.md` — not started.
- The `Membership` model question (retire it or find it a real purpose) — still not decided, as originally noted at the end of Phase 3.

## Phase 3 continued — Events, Resources (working through the CRUD domains before Stripe)

Directive for this stretch of work: finish every internal CRUD-and-content domain (Events → Resources → Leaders → Power Team → Community last), each with real member-facing wiring *and* an admin CRUD interface, before starting Premium paths (PBT Plus / PBT Mentorship + upgrade/downgrade/cancel) and then Stripe. Pagination is a standing priority on every list endpoint. The `countDocuments()` soft-delete bug flagged above was also extended to every other schema using the same pattern (Community, User, Event, Membership, PowerTeam, Resource, Subscription, Leader) — same one-line regex fix, not a new bug.

### Events — member RSVP flow + admin CRUD
- `Event.schema.ts`: added `requiredTier` (the Membership Gate for RSVP — unlike lessons, events genuinely are tier-gated per `docs/ui_adjustment.md`, so this one stays enforced) and real `startTime`/`endTime` fields; `timeLabel` is now derived from them instead of being a disconnected free-text field the admin editor already collected but nothing read.
- New `events.service.ts`: resolves each member's own RSVP state (`rsvped`/`rsvpDetails`) against the shared event document, enforces the tier gate, and enforces a real capacity check — RSVP previously had no capacity enforcement at all, so a member could join an already-full event. Cancel RSVP now also clears the stale `rsvpDetails` map entry instead of leaving it orphaned.
- `events.controller.ts`: every route now requires auth (each response needs the requesting member's own RSVP state resolved). New `GET /events/my-rsvps` for the "My RSVPs" tab, which had no backend endpoint before.
- New `admin-events` module, mirroring `admin-learning`'s shape: paginated/searchable/tab-filterable list, stats, get-by-id, create/update, cancel (deactivates without deleting — RSVP'd members keep their record) and delete, gated by `authorize('admin', 'super_admin')`.
- Frontend: member `events.repository.ts` wired to the real endpoints. Admin repository wired to `/admin/events/*`; reconciled a real vocabulary mismatch — the admin "Event Type" field (Live Online/In-Person/Workshop) had no backend counterpart at all and didn't match the member-facing category enum (Mentorship/In-Person/Community/Masterclass/Onboarding) the schema actually uses — unified on the real 5-value backend enum since the admin side was the untested outlier. New `src/lib/api-error.ts` shared error-message extractor, wired into toast feedback — RSVP can now genuinely fail (tier, capacity) where mock RSVPs always used to succeed silently.
- Verified live: curl for the tier gate (403), the capacity gate (400, distinct message from the tier gate), `my-rsvps`, cancel-RSVP cleanup, admin CRUD + role-gating; real browser for admin creates event → member sees it (tier-filtered) → RSVPs → appears in My RSVPs → cancels.

### Resources — member library + tier filtering + admin CRUD
This module had never been wired to auth or the frontend at all, so it carried three dormant, previously-invisible bugs:
1. **No authentication on member routes** — tier-gating was completely unenforced, and there was no way to know which member was asking. Added `authenticate` plus a new `allowedTiersFor(userId)` (one subscription fetch + rank comparison, feeding a single `$in` query — avoids an N+1 per-item tier check).
2. **Route-ordering bug** — `/:resourceId` was registered before `/categories/list`, `/types/list`, `/popular/top`, so Express's registration-order matching made the latter three completely unreachable. Reordered the specific routes first and added `/featured` alongside them.
3. **`getResourceById` incremented `downloads` on every view** — conflating viewing with downloading, and the real member UI never even calls `getResourceById`, so download tracking silently never fired in practice. Moved tracking to a dedicated `POST /resources/:resourceId/download`, which the member resource card now calls on click.

Also reconciled the schema's `type` enum (`Template|Guide|Tool|Video|Document`) to the vocabulary both the member and admin frontends already used consistently (`Template|Guide|Webinar|Toolkit`) — opposite direction from the Events fix, since here the *backend* was the untested outlier. Dropped the unused `category` field, added `isDraft` (mirrors the Lesson admin "Save as Draft" pattern) and `metaLabel`, relaxed `fileUrl`/`fileSize` to optional-with-defaults for the create-then-upload flow.

New `admin-resources` module: paginated list/search/category-filter, stats (published/drafts/total-downloads/top-category via aggregation), and file upload through the existing `storageProvider` abstraction — mounted at `/api/v1/admin/resources`.

Verified live: tier-gated list (a Plus-tier member sees Plus + Pathway resources; a Pathway-tier member does not see Plus-only resources), draft resources invisible to members regardless of tier, admin create/publish/upload/soft-delete, role-gating (403 for a non-admin token), auth requirement (401 unauthenticated), the route-ordering fix (`/types/list`, `/popular/top`, `/featured` all resolve correctly now), and download tracking reflected in admin stats.

### Known gaps and honest limitations, updated after Events + Resources
- Leaders, Power Team, and Community are still exactly as they were at the end of the previous phase (Community's routes are still commented out in `app.ts` pending the schema redesign decision below) — next up in this same sequence.
- **Community schema decision, resolved but not yet implemented**: the controller expects real reply-threading and per-user like-tracking; the schema only supports a flat structure with a numeric like counter. Decision (explicitly confirmed by the product owner): full redesign to match what the controller already expects — real threading (subdocument array or separate collection) and per-user like arrays, not a numeric counter — since this is a new product with no production data to migrate. Not yet implemented.
- Premium paths (PBT Plus / PBT Mentorship + upgrade/downgrade/cancel) and the subsequent multi-tier real-user testing pass are still ahead of Stripe, per the agreed sequencing.

### Leaders — real directory + admin CRUD
`Leader.schema.ts` had never been wired to either frontend, so its shape didn't match what either actually expected:
- `fullName` was only ever available via a populated `userId` — but `userId` was required+unique, with no admin UI path to ever set it. A Leader profile is admin-authored directory content, not necessarily tied to a platform login: made `userId` optional and store `fullName` directly.
- `location`, `yearsActive`, and `isTopMentor` didn't exist at all, despite both the member card/detail views and the admin editor/table already expecting them. Added all three.
- `region` was a free string; constrained it to the same 4-value enum both frontends already use consistently.
- Renamed `title` → `specialty` and `specialism` → `specialties` for 1:1 clarity against the frontend fields they actually feed (headline badge vs. the detail page's breakdown list). Dropped `phone`/`linkedinUrl`/`menteeCount` — unused by any current UI, and this module was never tested, so nothing depended on keeping them.

Also fixed the same route-ordering bug found in Events/Resources (`/:leaderId` registered before `/regions/list`, `/top/rated`, `/region/:region`, making all three unreachable), added `authenticate` to the member routes (previously none at all), and made `getLeaderById` respect `isActive` so a deactivated leader is hidden from direct-by-id lookups too, not just the list.

New `admin-leaders` module mirrors the `admin-events`/`admin-resources` shape: paginated list/search/region-filter, stats, and a photo upload endpoint through the existing `storageProvider` abstraction.

**Two more real bugs found live-testing this domain:**
1. **`distinct()` bypassing soft-delete.** `Leader.distinct('region')` still counted a soft-deleted leader's region after deleting it — `distinct` is a separate Mongoose operation name the existing soft-delete regex (`/^find|^countDocuments/`) never matched, the same class of bug as the `countDocuments` gap fixed earlier this session, just a different operation. Extended the regex to `/^find|^countDocuments|^distinct/` across all 9 schemas using this pattern (Community, Event, Leader, Membership, PowerTeam, Resource, Subscription, User, and the three Learning sub-schemas), since every one is exposed to the same gap wherever a `.distinct()` call exists now or gets added later.
2. **Uploaded photos never rendered.** helmet's default `Cross-Origin-Resource-Policy: same-origin` on every response (including the static `/uploads` mount) blocks any cross-origin embed of these files — true in local dev (frontend `:3000`, backend `:5000`) and would be true in any real deployment where the media host isn't on the exact same origin as the app. Relaxed CORP to `cross-origin` specifically for the `/uploads` path, since these are meant to be publicly embeddable assets. This fix applies to the whole `/uploads` path, not just Leader photos.

Frontend: member repository rewritten to `apiClient` (computing initials client-side from `fullName`, same approach the admin editor already used); admin repository rewritten to `adminApiClient`; `AdminLeader` gained `location`/`yearsActive`/`specialties`; the editor gained the Location/Years Active/Specialties fields it was missing entirely plus a working Top Mentor toggle (the field existed on the type with no way to set it); the "Upload Photo" button now actually uploads instead of being decorative. New shared `src/components/shared/avatar.tsx` falls back to an initials circle on image load failure instead of a permanent broken-image icon, used across all four places that render a leader's photo.

Verified live (curl + Playwright browser): region-filtered directory, detail view with specialties + Top Mentor badge, full admin create → edit → photo upload → deactivate → soft-delete flow, role-gating, and — after the two fixes above — a real photo rendering correctly end-to-end while a genuinely broken photo URL falls back to initials instead of a broken-image icon.

### Power Team — real directory + admin CRUD
Same shape of gaps as every other never-wired domain this session:
- Same route-ordering bug as Events/Resources/Leaders: `/:memberId` registered before `/category/:category`, `/categories/list`, `/regions/list`, `/verified/list`, making all four unreachable. Reordered.
- No authentication on member routes at all — added `authenticate`.
- `getMemberById` didn't respect `isActive`, so a suspended partner stayed reachable by direct ID even though the list correctly hid them — same fix as Leaders.
- **"Letting Agents" added to the category enum** — the member-facing filter tabs already included it (with seeded mock partners in that category), but the schema's enum, and the admin category list, never had it, so an admin could never actually create one.
- Added `categoryLabel` (an admin-settable specific label like "RICS Surveyors", separate from the coarse filterable `category`) and `website` — fields the member frontend already rendered but had no backing data or admin form field for. Dropped `company`/`linkedinUrl`/`specialisms`/`rating`/`reviewCount` — unused by any current UI, and this module was never tested, so nothing depended on keeping them.
- The admin's 3-state "Verification Status" (Verified/Pending Review/Suspended) is derived from `isActive` + `isVerified` rather than a new field: Suspended is `isActive:false` (consistent with every other "deactivate" flag in this codebase), Verified vs Pending Review is `isVerified` on an otherwise-active partner.

New `admin-power-team` module mirrors the `admin-leaders`/`admin-resources` shape: paginated list/search/category-filter, stats, and a logo upload endpoint through the existing `storageProvider` abstraction.

**Real bug found live-testing partner creation:** the email regex's TLD group only allowed 2-3 characters (`/(\.\w{2,3})+$/`), rejecting a placeholder `.example` domain — and, more importantly, any real TLD longer than 3 characters (`.info`, `.london`, `.education`, etc.). This same regex is also used on `User.schema.ts` for actual member registration, so this wasn't just a test artifact — it would reject real signups too. Widened to `{2,}` (no upper bound) across `User`, `Leader`, and `PowerTeamMember`, the three schemas that shared this exact pattern.

Frontend: member repository rewritten to `apiClient` (mapping `region`→`city`, `contactEmail`→`email`, computing initials client-side); `partner-card`/`partner-profile-dialog` now use the shared `Avatar` component and only render the website link when one exists. Admin repository rewritten to `adminApiClient`; `AdminPartner` gained `categoryLabel`/`website`, `AdminPartnerCategory` gained "Letting Agents"; the editor gained the Specific Label and Website fields it was missing entirely, and "Upload Logo" now actually uploads. Removed `partner-form-dialog.tsx` — a second, unused create/edit flow (not imported anywhere) that duplicated the editor with a worse bug (a fake client-side id) rather than fixing dead code.

Verified live (curl + Playwright browser): category-filtered directory including the newly-added Letting Agents category, previously-unreachable routes now resolving, verified-partner badge, full admin create → edit → logo upload → suspend → soft-delete flow, role-gating, and a real logo rendering correctly on both the member card and profile dialog.

### Community — full schema redesign, real replies/likes/moderation, re-enabled
Per explicit product decision (**full redesign**, not a controller-side patch — confirmed with the product owner): the controller already expected real reply-threading (`thread.replies` as a populated subdocument array) and per-user like tracking (`thread.likes.includes(userId)`/`.push`/`.filter`), but the schema only ever supported a flat, differently-shaped `comments` array and a plain numeric `likes` counter. No production data existed to migrate, so the schema was rebuilt to match what the controller (and both frontends) actually need, rather than simplifying the controller down to the old shape. Community's routes had been entirely commented out in `app.ts` since Phase 1 pending this decision — **re-enabled now**.

- Rewrote `CommunityThread`: real `replies` subdocument array (`authorId`, `content`, timestamps), `likedBy: ObjectId[]` for per-user like toggling, `authorId` (was `author`, a name mismatch against what the controller already used), `reportCount`/`reportReason` backing the admin moderation queue. Dropped the old `comments`/`views` fields — unused by any current UI.
- **Second latent bug found in the same file**: every action used `(req as any).userId`, which doesn't exist — the auth middleware sets `req.user.userId` — so every like/reply/create was silently running as `undefined` before this rewrite, independent of the schema mismatch.
- New `CommunityAnnouncement` schema: a single-slot-at-a-time banner, distinct from a pinned *discussion* (`CommunityThread.isPinned`) — the member Community page shows one active announcement at the top, independent of any regular post.
- **Leader Spotlight** is derived from `Leader.isTopMentor` — no new admin flag, same "derived query" pattern used for Resources' Featured Toolkit. Confirmed live against the real "Browser Test Leader" created earlier this session.
- **Community Groups (membership) is a known, deliberately deferred gap** — no group/membership model exists yet. Returns an honest empty list (the member UI already has a correct empty state for this) rather than inventing a full group-membership subsystem out of scope for this pass.

New `admin-community` module: paginated all-posts list, flagged-post moderation queue (approve clears the flag, remove soft-deletes), pinned announcement CRUD, and a **pin/unpin action for individual discussions** — added because `isPinned` existed on the schema with no way for an admin to ever actually set it, the same "declared but unreachable" gap found in every other domain this session. Also added a **member-facing "Report" action** (previously nothing could ever populate the Flagged queue at all) and fixed `pinnedCount` in admin stats, which was counting pinned *discussions* instead of active *announcements* despite the stat card being labeled "Pinned Announcements".

Frontend: member repository rewritten to `apiClient`; create/reply mutations no longer send `authorName`/`authorInitials` client-side — the backend now derives the author from the JWT (more correct — a client can't be trusted to self-report its own identity). `discussion-detail-view.tsx` gained the Report action. Admin repository rewritten to `adminApiClient`; `AllPostsCard` gained real pagination + search (previously an unbounded list with no paging) and the pin/unpin button; the "New Announcement" dialog gained a Message field (previously only collected a title, leaving the member banner's body permanently empty).

Verified live (curl + Playwright browser): create/reply/like (per-user, confirmed two different users see independent `likedByMe` state) all correctly authenticated; report → appears in admin Flagged queue → approve clears it (post stays visible) or remove soft-deletes it; pin toggle reflected on both admin and member sides; announcement create/unpin reflected in the member banner; role tags (PBT Plus/PBT Mentorship/PBT Leader) derived correctly from real subscription and Leader data.

**Also discovered, out of scope for this domain:** navigating from an admin session back to a member page in the same browser tab can incorrectly trigger a "membership expired" gate even though the member's seeded subscription is active through 2027 — confirmed real Community functionality is unaffected via a clean single-session test. Likely a session/cache collision in the subscription-status check; flagged for the upcoming Premium paths phase, where that gate is the actual focus.

## Phase 3 continued — Session collision fix (Premium paths prerequisite)

### Root cause: admin and member logins shared one refresh cookie
Both portals authenticated against the same `/auth/login` and `/auth/refresh-token` endpoints, which set/read a single globally-named `refreshToken` httpOnly cookie. Cookies are scoped by domain, not port, so with both frontends on the same host, logging into one portal silently overwrote the other's persistent (`rememberMe`) refresh cookie — the next silent session-restore for the other portal (any full page load) would then authenticate as the wrong account entirely.

Caught concretely (flagged at the end of the Community work): a member session correctly showed the Community page, then an admin login in the same tab, then navigating back to the member Community page incorrectly showed a "membership has expired" gate. The displayed lapse date matched today's date, not either seeded subscription's real end date (both valid through 2027) — that's the fallback used when the subscription lookup 404s, exactly what happens when the member page's silent refresh resolves to the admin account (no subscription record) instead of the member's.

This was already known and documented as an accepted limitation in `admin-auth.repository.ts` ("these are different people on different machines in practice") — but that assumption doesn't hold for admin staff who are also members, or anyone testing both portals in one browser, so it's fixed properly now.

### Fix
Added admin-only endpoints — `POST /auth/admin/login`, `/auth/admin/refresh-token`, `/auth/admin/logout` — that set/read a distinct `adminRefreshToken` cookie, so an admin and a member session in the same browser no longer contend for one cookie. The member-facing `/auth/login`, `/auth/refresh-token`, `/auth/logout` are untouched. Frontend `admin-auth.repository.ts` now points at these new endpoints.

**Closed a related gap while touching this:** the admin-only role check was previously enforced only by the admin frontend (bypassable by calling `/auth/login` directly) — `/admin/*` API routes were always properly gated server-side via `authorize('admin', 'super_admin')`, but login itself accepted any valid credentials regardless of role. `/auth/admin/login` now rejects non-admin credentials with 403 server-side.

Verified live: curl with a single shared cookie jar simulating the exact collision (member login, then admin login, then refreshing each independently) — both sessions now resolve to their own correct account. Confirmed in a real browser too: the previously-broken sequence (member session → admin login → back to member Community) now works correctly end to end, with no false "expired" gate.
