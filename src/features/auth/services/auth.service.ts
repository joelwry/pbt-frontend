import { authRepository } from "@/features/auth/repositories/auth.repository";
import type { LoginCredentials, AuthSession, RefreshedSession } from "@/features/auth/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await authRepository.login(credentials);
    return response.data;
  },

  async refresh(refreshToken: string | null): Promise<RefreshedSession> {
    const response = await authRepository.refresh(refreshToken);
    return response.data;
  },

  async restoreSession(): Promise<AuthSession | null> {
    const response = await authRepository.restoreSession();
    return response?.data ?? null;
  },

  async logout(): Promise<void> {
    await authRepository.logout();
  },
};
