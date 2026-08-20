// "Admin" corresponds to the backend's plain 'admin' role (see User.schema.ts
// role enum). Section grants ARE enforced server-side now -- every admin
// module's route file carries requireSection(...) (sectionMiddleware.ts), so
// an admin only reaches the sections actually granted on their account; this
// comment previously said otherwise and was stale.
//
// The three named staff roles below are still presentation-only: the backend
// has no role beyond member/admin/super_admin, so picking one here just
// seeds a different default set of sections (ROLE_DEFAULT_SECTIONS in
// permissions.ts) on an account that is a plain 'admin' server-side.
export type AdminRole = "Super Admin" | "Admin" | "Content Manager" | "Community Moderator" | "Support Staff";

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
  /** Section-level access grants. Ignored for "Super Admin", who always has full access. */
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
