import { adminAuthRepository } from "@/features/admin-auth/repositories/admin-auth.repository";
import type { AdminLoginCredentials, AdminAuthSession, AdminRefreshedSession } from "@/features/admin-auth/types";

export const adminAuthService = {
  async login(credentials: AdminLoginCredentials): Promise<AdminAuthSession> {
    const response = await adminAuthRepository.login(credentials);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<AdminRefreshedSession> {
    const response = await adminAuthRepository.refresh(refreshToken);
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await adminAuthRepository.logout(refreshToken);
  },
};
