// The five staff roles, as the backend defines them (core/auth/adminAccess.ts).
// These canonical constants are what the API sends and expects -- the labels
// below are for display only, so the two repos never drift into separate role
// vocabularies. The repos share no package by design, so this list is a
// deliberate duplicate: keep it in step with ADMIN_ROLES on the backend.
//
// Every role except SUPER_ADMIN is a plain 'admin' as far as the backend's
// authorize() gate is concerned; what separates them is the sections each one
// grants by default, enforced by requireSection(...) on every admin route.
export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "COMMUNITY_MODERATOR", "SUPPORT_STAFF"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  CONTENT_MANAGER: "Content Manager",
  COMMUNITY_MODERATOR: "Community Moderator",
  SUPPORT_STAFF: "Support Staff",
};

export type AdminSection =
  | "members"
  | "content"
  | "resources"
  | "events"
  | "community"
  | "pbtLeaders"
  | "powerTeam"
  | "subscriptions"
  | "analytics"
  | "referrals";

export interface AdminUser {
  id: string;
  adminId: string;
  fullName: string;
  initials: string;
  email: string;
  role: AdminRole;
  /**
   * The sections this account can actually reach, as resolved by the
   * backend: its role's defaults where nothing has been customised, its
   * explicit grants where it has. Not a wish list -- what the API will
   * actually allow.
   */
  sections: AdminSection[];
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
  rememberDevice: boolean;
}

export interface AdminAuthSession {
  accessToken: string;
  /** Absent for persistent (rememberDevice) sessions — those rely on the httpOnly refresh cookie instead. */
  refreshToken?: string;
  /** Access token lifetime in seconds. */
  expiresIn: number;
  admin: AdminUser;
}

export interface AdminRefreshedSession {
  accessToken: string;
  /** Present only when the refresh call supplied a body token (memory-mode rotation). */
  refreshToken?: string;
  expiresIn: number;
}
