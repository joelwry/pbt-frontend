export type AdminRole = "Super Admin" | "Content Manager" | "Community Moderator" | "Support Staff";

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
  refreshToken: string;
  expiresIn: number;
  admin: AdminUser;
}

export interface AdminRefreshedSession {
  accessToken: string;
  expiresIn: number;
}
