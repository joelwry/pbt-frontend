import type { CurrentMember } from "@/features/session/types";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  /** Access token lifetime in seconds, as the real API would return it. */
  expiresIn: number;
  member: CurrentMember;
}

export interface RefreshedSession {
  accessToken: string;
  expiresIn: number;
}
