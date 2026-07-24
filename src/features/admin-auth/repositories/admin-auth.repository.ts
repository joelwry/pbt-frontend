import type { ApiSuccess, ApiError } from "@/types/api";
import type { AdminLoginCredentials, AdminAuthSession, AdminRefreshedSession } from "@/features/admin-auth/types";
import { MOCK_ADMIN_DIRECTORY } from "@/features/admin-auth/mocks/admin-directory.mock";
import { createMockToken, decodeMockToken, isTokenExpired } from "@/features/auth/token-utils";

const SIMULATED_LATENCY_MS = 700;

export class AdminAuthApiError extends Error {
  errors: string[];
  constructor(payload: ApiError) {
    super(payload.message);
    this.errors = payload.errors;
  }
}

const issuedRefreshTokens = new Map<string, string>();

export const adminAuthRepository = {
  async login(credentials: AdminLoginCredentials): Promise<ApiSuccess<AdminAuthSession>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const record = MOCK_ADMIN_DIRECTORY[credentials.email.trim().toLowerCase()];

    if (!record) {
      throw new AdminAuthApiError({
        success: false,
        message: "No admin account found for that email address",
        errors: ["Admin accounts are provisioned manually by a super-admin. Contact IT support if you need access."],
      });
    }

    if (record.password !== credentials.password) {
      throw new AdminAuthApiError({
        success: false,
        message: "Incorrect password",
        errors: ["The password you entered is incorrect."],
      });
    }

    const accessToken = createMockToken(record.admin.id, "access", record.accessTokenTtl);
    const refreshToken = createMockToken(record.admin.id, "refresh", record.refreshTokenTtl);
    issuedRefreshTokens.set(refreshToken, credentials.email.trim().toLowerCase());

    return {
      success: true,
      message: "Signed in successfully",
      data: { accessToken, refreshToken, expiresIn: record.accessTokenTtl, admin: record.admin },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.post<ApiSuccess<AdminAuthSession>>("/admin/auth/login", credentials);
    // return data;
  },

  async refresh(refreshToken: string): Promise<ApiSuccess<AdminRefreshedSession>> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (isTokenExpired(refreshToken)) {
      throw new AdminAuthApiError({
        success: false,
        message: "Session expired",
        errors: ["Your refresh token has expired. Please log in again."],
      });
    }

    const email = issuedRefreshTokens.get(refreshToken);
    const decoded = decodeMockToken(refreshToken);
    if (!email || !decoded) {
      throw new AdminAuthApiError({
        success: false,
        message: "Invalid refresh token",
        errors: ["This session could not be verified. Please log in again."],
      });
    }

    const record = MOCK_ADMIN_DIRECTORY[email];
    if (!record) {
      throw new AdminAuthApiError({
        success: false,
        message: "Invalid refresh token",
        errors: ["This session could not be verified. Please log in again."],
      });
    }

    const accessToken = createMockToken(record.admin.id, "access", record.accessTokenTtl);
    return { success: true, message: "Token refreshed successfully", data: { accessToken, expiresIn: record.accessTokenTtl } };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.post<ApiSuccess<AdminRefreshedSession>>("/admin/auth/refresh", { refreshToken });
    // return data;
  },

  async logout(refreshToken: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    issuedRefreshTokens.delete(refreshToken);

    // Live implementation, once the Express API exists:
    // await apiClient.post("/admin/auth/logout", { refreshToken });
  },
};
