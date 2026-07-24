import type { AdminUser, AdminRole, AdminSection } from "@/features/admin-auth/types";

export const ADMIN_SECTION_LABELS: Record<AdminSection, string> = {
  members: "Members",
  content: "Content",
  resources: "Resources",
  events: "Events",
  community: "Community",
  pbtLeaders: "PBT Leaders",
  powerTeam: "Power Team",
  subscriptions: "Subscriptions & Billing",
  analytics: "Analytics & Reports",
};

export const ADMIN_SECTION_ROUTES: Record<AdminSection, string> = {
  members: "/admin/members",
  content: "/admin/content",
  resources: "/admin/resources",
  events: "/admin/events",
  community: "/admin/community",
  pbtLeaders: "/admin/pbt-leaders",
  powerTeam: "/admin/power-team",
  subscriptions: "/admin/subscriptions",
  analytics: "/admin/analytics",
};

/** Suggested default access when a role is picked in the Invite Admin User form. Editable afterward. */
export const ROLE_DEFAULT_SECTIONS: Record<AdminRole, AdminSection[]> = {
  "Super Admin": Object.keys(ADMIN_SECTION_LABELS) as AdminSection[],
  "Content Manager": ["content", "resources"],
  "Community Moderator": ["community", "events"],
  "Support Staff": ["members"],
};

export function hasSection(admin: AdminUser, section: AdminSection): boolean {
  return admin.role === "Super Admin" || admin.sections.includes(section);
}

/** Nav items only need the two fields below, so this stays decoupled from the nav-config module. */
export function canAccessAdminNavItem(admin: AdminUser, item: { section?: AdminSection; superAdminOnly?: boolean }): boolean {
  if (item.superAdminOnly) return admin.role === "Super Admin";
  if (item.section) return hasSection(admin, item.section);
  return true;
}

export function isAdminRouteAllowed(admin: AdminUser, pathname: string): boolean {
  if (pathname === "/admin/admin-users" || pathname.startsWith("/admin/admin-users/")) {
    return admin.role === "Super Admin";
  }
  const entry = (Object.entries(ADMIN_SECTION_ROUTES) as [AdminSection, string][]).find(
    ([, route]) => pathname === route || pathname.startsWith(route + "/")
  );
  if (!entry) return true; // dashboard, profile, and any unmapped route are always allowed once authenticated
  return hasSection(admin, entry[0]);
}

export function accessibleSectionLabels(admin: AdminUser): string[] {
  if (admin.role === "Super Admin") return Object.values(ADMIN_SECTION_LABELS);
  return admin.sections.map((s) => ADMIN_SECTION_LABELS[s]);
}
