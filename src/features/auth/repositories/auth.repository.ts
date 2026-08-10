import axios from "axios";
import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiError } from "@/types/api";
import type { LoginCredentials, AuthSession, RefreshedSession } from "@/features/auth/types";
import type { CurrentMember, MembershipTier } from "@/features/session/types";

export class AuthApiError extends Error {
  errors: string[];
  constructor(payload: ApiError) {
    super(payload.message);
    this.errors = payload.errors;
  }
}

function toAuthApiError(error: unknown): AuthApiError {
  if (axios.isAxiosError(error) && error.response?.data) {
    const payload = error.response.data as Partial<ApiError>;
    return new AuthApiError({
      success: false,
      message: payload.message ?? "Something went wrong. Please try again.",
      errors: payload.errors ?? [],
    });
  }
  return new AuthApiError({
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
}

interface BackendTokens {
  accessToken: string;
  refreshToken: string;
}

interface BackendSubscription {
  tier: "pathway" | "plus" | "mentorship";
  status: "active" | "pending" | "cancelled" | "expired";
  startDate: string;
  endDate: string;
}

function toMembershipTier(tier: BackendSubscription["tier"]): MembershipTier {
  return (tier.charAt(0).toUpperCase() + tier.slice(1)) as MembershipTier;
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

// JWTs carry their own `exp` claim — decoding it locally (no signature
// verification needed, it's only used to schedule the proactive refresh)
// keeps the frontend in sync with whatever access-token TTL the backend is
// configured with, instead of duplicating that value.
function expiresInFromJwt(token: string): number {
  const payload = token.split(".")[1];
  const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { exp: number };
  return Math.max(Math.floor(decoded.exp - Date.now() / 1000), 0);
}

// No subscription record exists for an account until one is created via the
// real payment flow (see renew-subscription.repository.ts) — a 404 here is a
// real "never subscribed" state, not an error, so it's treated conservatively
// as an expired Pathway subscription rather than a broken request.
async function fetchSubscription(accessToken: string): Promise<BackendSubscription | null> {
  try {
    const { data } = await apiClient.get<ApiSuccess<BackendSubscription>>("/subscriptions/current", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data.data;
  } catch {
    return null;
  }
}

async function composeMember(user: BackendUser, accessToken: string): Promise<CurrentMember> {
  const subscription = await fetchSubscription(accessToken);
  return {
    id: user.id,
    clientId: user.clientId ?? user.id,
    fullName: user.fullName,
    initials: initialsOf(user.fullName),
    email: user.email,
    avatarUrl: user.avatarUrl,
    membershipTier: subscription ? toMembershipTier(subscription.tier) : "Pathway",
    subscriptionStatus: subscription?.status === "active" ? "active" : "expired",
    subscriptionDate: subscription?.endDate ?? subscription?.startDate ?? new Date().toISOString(),
  };
}

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<ApiSuccess<AuthSession>> {
    try {
      const { data } = await apiClient.post<ApiSuccess<{ user: BackendUser; tokens: BackendTokens }>>(
        "/auth/login",
        credentials
      );
      const { user, tokens } = data.data;
      const member = await composeMember(user, tokens.accessToken);

      return {
        success: true,
        message: data.message,
        data: {
          accessToken: tokens.accessToken,
          // Persistent sessions rely solely on the httpOnly refresh cookie —
          // holding the value in JS memory too would defeat that protection.
          refreshToken: credentials.rememberMe ? undefined : tokens.refreshToken,
          expiresIn: expiresInFromJwt(tokens.accessToken),
          member,
        },
      };
    } catch (error) {
      throw toAuthApiError(error);
    }
  },

  /** Pass null to refresh via the httpOnly cookie (persistent sessions). */
  async refresh(refreshToken: string | null): Promise<ApiSuccess<RefreshedSession>> {
    try {
      const { data } = await apiClient.post<ApiSuccess<BackendTokens>>(
        "/auth/refresh-token",
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
      throw toAuthApiError(error);
    }
  },

  /** Attempts to restore a persistent session from the httpOnly refresh cookie on app boot. Returns null if there is none (or it's expired) — this is an expected, silent outcome, not an error. */
  async restoreSession(): Promise<ApiSuccess<AuthSession> | null> {
    try {
      const { data: tokenData } = await apiClient.post<ApiSuccess<BackendTokens>>("/auth/refresh-token", {});
      const { accessToken } = tokenData.data;

      const { data: userData } = await apiClient.get<ApiSuccess<BackendUser>>("/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const member = await composeMember(userData.data, accessToken);

      return {
        success: true,
        message: tokenData.message,
        data: { accessToken, expiresIn: expiresInFromJwt(accessToken), member },
      };
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      // Explicit {} body — axios omits Content-Type on a bodyless POST, which
      // the backend's requestValidationMiddleware then rejects with 415.
      await apiClient.post("/auth/logout", {});
    } catch {
      // Best-effort — local state is cleared regardless.
    }
  },

  /**
   * Used both by "forgot password" and by the first-time account-setup link
   * (admin-created member, or eventually a first-ever Stripe subscription) —
   * the backend's reset-password endpoint is the same token-gated mechanism
   * either way, only the surrounding page copy differs.
   */
  async setNewPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Backend requires confirmPassword in the body too (defense against a
      // client-only mismatch check) — the form already validated equality.
      await apiClient.post("/auth/reset-password", { token, newPassword, confirmPassword: newPassword });
    } catch (error) {
      throw toAuthApiError(error);
    }
  },
};
