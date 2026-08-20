import axios from "axios";
import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiError } from "@/types/api";
import type {
  AdminLoginCredentials,
  AdminAuthSession,
  AdminRefreshedSession,
  AdminUser,
  AdminRole,
  AdminSection,
} from "@/features/admin-auth/types";
import { ADMIN_SECTION_LABELS } from "@/features/admin-auth/permissions";
import { ADMIN_ROLES } from "@/features/admin-auth/types";

export class AdminAuthApiError extends Error {
  errors: string[];
  constructor(payload: ApiError) {
    super(payload.message);
    this.errors = payload.errors;
  }
}

function toAdminAuthApiError(error: unknown): AdminAuthApiError {
  if (axios.isAxiosError(error) && error.response?.data) {
    const payload = error.response.data as Partial<ApiError>;
    return new AdminAuthApiError({
      success: false,
      message: payload.message ?? "Something went wrong. Please try again.",
      errors: payload.errors ?? [],
    });
  }
  return new AdminAuthApiError({
    success: false,
    message: "Something went wrong. Please try again.",
    errors: [],
  });
}

interface BackendUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  clientId?: string;
  avatarUrl?: string;
  /** The account's staff role, one of ADMIN_ROLES -- see toAdminRole below. */
  adminRole?: string;
  /** Effective section access for this admin account -- see composeAdmin below. */
  adminSections?: string[];
}

interface BackendTokens {
  accessToken: string;
  refreshToken: string;
}

// The backend enforces admin-only access to these endpoints server-side
// (rejecting non-admin credentials at /auth/admin/login with 403), so this
// is defense-in-depth on the frontend, not the only gate.
const ADMIN_BACKEND_ROLES = new Set(["admin", "super_admin"]);

/**
 * The account's staff role as the API reports it. `adminRole` is
 * authoritative; the coarse `role` is only a fallback for a session issued
 * before the API carried the field (or by an environment mid-deploy), where
 * the same inference the backend makes applies.
 */
function toAdminRole(user: BackendUser): AdminRole {
  if (user.adminRole && (ADMIN_ROLES as readonly string[]).includes(user.adminRole)) {
    return user.adminRole as AdminRole;
  }
  return user.role === "super_admin" ? "SUPER_ADMIN" : "ADMIN";
}

function initialsOf(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

function expiresInFromJwt(token: string): number {
  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { exp: number };
  return Math.max(Math.floor(decoded.exp - Date.now() / 1000), 0);
}

const KNOWN_SECTIONS = new Set(Object.keys(ADMIN_SECTION_LABELS) as AdminSection[]);

/** Only sections this frontend actually knows about -- an unrecognised value from the API is dropped rather than left to break a lookup. */
function toSections(adminSections: string[] | undefined): AdminSection[] {
  return (adminSections ?? []).filter((section): section is AdminSection => KNOWN_SECTIONS.has(section as AdminSection));
}

function composeAdmin(user: BackendUser): AdminUser {
  const role = toAdminRole(user);
  return {
    id: user.id,
    adminId: user.id,
    fullName: user.fullName,
    initials: initialsOf(user.fullName),
    email: user.email,
    role,
    // The account's effective grants, resolved and sent by the API -- role
    // defaults where nothing was customised, explicit grants where it was.
    // This used to be ROLE_DEFAULT_SECTIONS[role], guessed on the client,
    // which handed every plain admin all ten sections regardless of what
    // they actually held: a staff account granted only Content still saw
    // Members, Billing and Analytics in the nav, opened them, and hit a
    // wall of 403s from an API that was gating correctly all along.
    sections: toSections(user.adminSections),
  };
}

function assertIsAdmin(user: BackendUser): void {
  if (!ADMIN_BACKEND_ROLES.has(user.role)) {
    throw new AdminAuthApiError({
      success: false,
      message: "This account does not have admin access",
      errors: ["Admin accounts are provisioned manually by a super-admin. Contact IT support if you need access."],
    });
  }
}

export const adminAuthRepository = {
  async login(credentials: AdminLoginCredentials): Promise<ApiSuccess<AdminAuthSession>> {
    try {
      const { data } = await adminApiClient.post<ApiSuccess<{ user: BackendUser; tokens: BackendTokens }>>(
        "/auth/admin/login",
        { email: credentials.email, password: credentials.password, rememberMe: credentials.rememberDevice }
      );
      const { user, tokens } = data.data;
      assertIsAdmin(user);

      return {
        success: true,
        message: data.message,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: credentials.rememberDevice ? undefined : tokens.refreshToken,
          expiresIn: expiresInFromJwt(tokens.accessToken),
          admin: composeAdmin(user),
        },
      };
    } catch (error) {
      if (error instanceof AdminAuthApiError) throw error;
      throw toAdminAuthApiError(error);
    }
  },

  /** Pass null to refresh via the httpOnly cookie (persistent sessions). */
  async refresh(refreshToken: string | null): Promise<ApiSuccess<AdminRefreshedSession>> {
    try {
      const { data } = await adminApiClient.post<ApiSuccess<BackendTokens>>(
        "/auth/admin/refresh-token",
        refreshToken ? { refreshToken } : {}
      );

      return {
        success: true,
        message: data.message,
        data: {
          accessToken: data.data.accessToken,
          refreshToken: refreshToken ? data.data.refreshToken : undefined,
          expiresIn: expiresInFromJwt(data.data.accessToken),
        },
      };
    } catch (error) {
      throw toAdminAuthApiError(error);
    }
  },

  /**
   * Attempts to restore a persistent admin session from the httpOnly refresh
   * cookie on app boot — mirrors the member auth restoreSession() flow.
   * Uses the admin-only /auth/admin/refresh-token endpoint (a distinct
   * adminRefreshToken cookie) so an admin and a member logged in
   * persistently in the same browser no longer contend for one cookie.
   */
  async restoreSession(): Promise<ApiSuccess<AdminAuthSession> | null> {
    try {
      const { data: tokenData } = await adminApiClient.post<ApiSuccess<BackendTokens>>("/auth/admin/refresh-token", {});
      const { accessToken } = tokenData.data;

      const { data: userData } = await adminApiClient.get<ApiSuccess<BackendUser>>("/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      assertIsAdmin(userData.data);

      return {
        success: true,
        message: tokenData.message,
        data: { accessToken, expiresIn: expiresInFromJwt(accessToken), admin: composeAdmin(userData.data) },
      };
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await adminApiClient.post("/auth/admin/logout", {});
    } catch {
      // Best-effort — local state is cleared regardless.
    }
  },
};
