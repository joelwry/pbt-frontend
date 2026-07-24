import { authRepository } from "@/features/auth/repositories/auth.repository";
import type { LoginCredentials, AuthSession, RefreshedSession } from "@/features/auth/types";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await authRepository.login(credentials);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<RefreshedSession> {
    const response = await authRepository.refresh(refreshToken);
    return response.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await authRepository.logout(refreshToken);
  },
};
