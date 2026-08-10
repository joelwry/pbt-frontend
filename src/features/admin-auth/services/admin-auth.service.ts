import { adminAuthRepository } from "@/features/admin-auth/repositories/admin-auth.repository";
import type { AdminLoginCredentials, AdminAuthSession, AdminRefreshedSession } from "@/features/admin-auth/types";

export const adminAuthService = {
  async login(credentials: AdminLoginCredentials): Promise<AdminAuthSession> {
    const response = await adminAuthRepository.login(credentials);
    return response.data;
  },

  /** Pass null to refresh via the httpOnly cookie (persistent sessions). */
  async refresh(refreshToken: string | null): Promise<AdminRefreshedSession> {
    const response = await adminAuthRepository.refresh(refreshToken);
    return response.data;
  },

  async restoreSession(): Promise<AdminAuthSession | null> {
    const response = await adminAuthRepository.restoreSession();
    return response?.data ?? null;
  },

  async logout(): Promise<void> {
    await adminAuthRepository.logout();
  },
};
