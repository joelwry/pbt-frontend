/**
 * Access tokens live in memory only (see api-client.ts). AuthProvider owns
 * the token as React state for rendering, but apiClient's request
 * interceptor runs outside React, so it reads the latest value from here —
 * AuthProvider calls setAccessToken() every time the token changes.
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}
