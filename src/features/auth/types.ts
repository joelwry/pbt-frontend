import type { CurrentMember } from "@/features/session/types";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthSession {
  accessToken: string;
  /** Absent for persistent (rememberMe) sessions — those rely on the httpOnly refresh cookie instead. */
  refreshToken?: string;
  /** Access token lifetime in seconds. */
  expiresIn: number;
  member: CurrentMember;
}

export interface RefreshedSession {
  accessToken: string;
  /** Present only when the refresh call supplied a body token (memory-mode rotation). */
  refreshToken?: string;
  expiresIn: number;
}
