import type { ApiSuccess, ApiError } from "@/types/api";
import type { LoginCredentials, AuthSession, RefreshedSession } from "@/features/auth/types";
import { MOCK_USER_DIRECTORY } from "@/features/auth/mocks/user-directory.mock";
import { createMockToken, decodeMockToken, isTokenExpired } from "@/features/auth/token-utils";

const SIMULATED_LATENCY_MS = 700;

export class AuthApiError extends Error {
  errors: string[];
  constructor(payload: ApiError) {
    super(payload.message);
    this.errors = payload.errors;
  }
}

// In-memory map of issued refresh tokens -> member email, so refresh() can look
// the member back up. A real backend would persist this (hashed) per session
// in the database instead, to support revocation.
const issuedRefreshTokens = new Map<string, string>();

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<ApiSuccess<AuthSession>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const record = MOCK_USER_DIRECTORY[credentials.email.trim().toLowerCase()];

    if (!record) {
      throw new AuthApiError({
        success: false,
        message: "No account found for that email address",
        errors: ["This email isn't registered. Membership access is set up after you subscribe on our main site."],
      });
    }

    if (record.password !== credentials.password) {
      throw new AuthApiError({
        success: false,
        message: "Incorrect password",
        errors: ["The password you entered is incorrect."],
      });
    }

    const accessToken = createMockToken(record.member.id, "access", record.accessTokenTtl);
    const refreshToken = createMockToken(record.member.id, "refresh", record.refreshTokenTtl);
    issuedRefreshTokens.set(refreshToken, credentials.email.trim().toLowerCase());

    return {
      success: true,
      message: "Signed in successfully",
      data: { accessToken, refreshToken, expiresIn: record.accessTokenTtl, member: record.member },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.post<ApiSuccess<AuthSession>>("/auth/login", credentials);
    // return data;
  },

  async refresh(refreshToken: string): Promise<ApiSuccess<RefreshedSession>> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (isTokenExpired(refreshToken)) {
      throw new AuthApiError({
        success: false,
        message: "Session expired",
        errors: ["Your refresh token has expired. Please log in again."],
      });
    }

    const email = issuedRefreshTokens.get(refreshToken);
    const decoded = decodeMockToken(refreshToken);
    if (!email || !decoded) {
      throw new AuthApiError({
        success: false,
        message: "Invalid refresh token",
        errors: ["This session could not be verified. Please log in again."],
      });
    }

    const record = MOCK_USER_DIRECTORY[email];
    if (!record) {
      throw new AuthApiError({
        success: false,
        message: "Invalid refresh token",
        errors: ["This session could not be verified. Please log in again."],
      });
    }

    const accessToken = createMockToken(record.member.id, "access", record.accessTokenTtl);
    return { success: true, message: "Token refreshed successfully", data: { accessToken, expiresIn: record.accessTokenTtl } };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.post<ApiSuccess<RefreshedSession>>("/auth/refresh", { refreshToken });
    // return data;
  },

  async logout(refreshToken: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    issuedRefreshTokens.delete(refreshToken);

    // Live implementation, once the Express API exists:
    // await apiClient.post("/auth/logout", { refreshToken });
  },
};
