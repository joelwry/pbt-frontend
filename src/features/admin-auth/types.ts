// "Admin" corresponds to the backend's plain 'admin' role (see User.schema.ts
// role enum) — the backend doesn't yet support granular per-admin section
// permissions, so an "Admin" gets every section; "Content Manager" /
// "Community Moderator" / "Support Staff" remain reserved for once that
// finer-grained backend RBAC exists.
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
  | "analytics";

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
