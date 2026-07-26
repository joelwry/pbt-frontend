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
