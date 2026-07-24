# PBT Platform — Next.js 15 + TypeScript

## Member Portal: complete
## Admin Portal: Batch 1 + Batch 2 complete (14 screens) + Batch 3 Phase 1 complete (6 screens)

## Run it locally
```bash
npm install
npm run dev
```
- Member portal: http://localhost:3000 → `/login`
- Admin portal: http://localhost:3000/admin → `/admin/login`

### Demo admin accounts (password for both: `password123`)
- **amaka@propertybusinesstraining.com** — Super Admin, full access to every admin page.
- **jenny.t@propertybusinesstraining.com** — Content Manager, restricted to Content, Resources and her own Profile. Log in as her to see the locked sidebar and the restricted dashboard view.

## Still no new packages
Donut charts and bar charts are hand-built with SVG/CSS (`components/shared/donut-chart.tsx`, `components/shared/simple-bar-chart.tsx`) — no charting library added.

---

## What's new this batch (Batch 3, Phase 1 — completed)

### Role-based access control (new, underlies everything below)
Admin accounts now have a granular role — **Super Admin**, **Content Manager**, **Community Moderator**, or **Support Staff** — each with a set of granted sections (Members, Content, Resources, Events, Community, PBT Leaders, Power Team, Subscriptions & Billing, Analytics & Reports). This is centralized in `features/admin-auth/permissions.ts`:
- The sidebar (`AdminNavList`, shared by desktop and mobile) greys out and locks any section the signed-in admin doesn't have, with a lock icon — matching the restricted-view screenshot exactly.
- `RequireAdminAuth` now also blocks direct URL access to a locked section (not just the sidebar), redirecting to the Dashboard with a toast.
- Only Super Admin can see/access **Admin Users & Roles**, regardless of granted sections.

### Admin Users & Roles (`/admin/admin-users`) + Invite/Edit (`/admin/admin-users/[accountId]`)
Stats (Super Admins, Staff Accounts, Invited & Not Active, Role Changes), role filter tabs, search, paginated table with role/status badges and an access-scope summary column. The editor is a full page: Staff Details (name, email, role) and a Section Access checklist that pre-fills to the selected role's defaults but stays fully editable — matches the invite flow in your screenshot. Super Admin accounts can't be deleted from the table as a safety guard.

### Staff Dashboard — restricted view (`/admin/dashboard`, role-aware)
Super Admin still sees the full dashboard unchanged. Every other role sees a new restricted view: an access-scope banner explaining what they can and can't see, then role-specific content. For **Content Manager** this reuses real numbers already in the app (`useAdminContentStats`, `useAdminResourcesStats`) plus a small "Your Tasks" list, matching your screenshot exactly. Community Moderator and Support Staff don't have a specific screenshot yet, so they get an honest generic fallback (Quick Access links to their granted sections) rather than invented stats — happy to build their dedicated dashboards once you have designs for them.

### Admin Profile & Settings (`/admin/profile`)
Personal Information, Notification Preferences (flagged content, failed payments, weekly summary), and a Security card for password changes. Scoped per signed-in admin, so Amaka and Jenny each see their own correct details in the demo.

---

## Fixes made in the previous session (screenshot-reported issues)
Avatar colour consistency, topbar background (white + shadow instead of translucent blur), mobile tab-bar overflow (systemic fix across Community/Members/Content/Resources/Events/Year Tabs), and missing back buttons on all /edit and /new pages via a new shared `BackLink` / `PageHeader backHref` pattern.

## Architecture (unchanged)
```
Page (app/**/page.tsx)
  -> Hook (features/*/hooks)
    -> Service (features/*/services)
      -> Repository (features/*/repositories)   <-- swap this for the real API call
        -> Mock (features/*/mocks)              <-- shaped exactly like the Express response
```

## Batch 3 Phase 1: complete
Subscriptions & Billing, Analytics & Reports, Power Team Editor upgrade, and now the full RBAC system (Admin Users & Roles, restricted Staff Dashboard, Admin Profile & Settings) are all done, type-checked, linted, and build-verified.

## Next: backend integration
This is a good point to start wiring up the real Express API. Every repository file in `features/*/repositories/` has the mock implementation plus a commented-out "live implementation" showing the exact `apiClient` call it should become — that's the map for swapping mocks out feature-by-feature once the backend's ready.


