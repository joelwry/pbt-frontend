/**
 * A separate in-memory store from access-token-store.ts. The admin portal
 * and the member portal are both mounted at once whenever an /admin/* page
 * renders (AdminAuthProvider nests inside the root AuthProvider), and they
 * authenticate against the same backend /auth/* endpoints — sharing one
 * token store would let an admin session and a member session silently
 * clobber each other's Authorization header. Keeping the two decoupled is
 * an explicit requirement (see pbt_frontend_backend_integration_handoff.md).
 */
let adminAccessToken: string | null = null;

export function getAdminAccessToken(): string | null {
  return adminAccessToken;
}

export function setAdminAccessToken(token: string | null): void {
  adminAccessToken = token;
}
