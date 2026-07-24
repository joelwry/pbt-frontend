import { useAuth } from "@/providers/auth-provider";

/**
 * Every feature in the app reads the logged-in member through this hook
 * rather than talking to AuthProvider directly, so the rest of the codebase
 * doesn't care whether session data comes from context, a query, or (once
 * the real API exists) a `/members/me` call restored from an httpOnly
 * refresh cookie on boot. Shape matches a useQuery result so no call sites
 * needed to change when auth moved from a mock query to real session state.
 */
export function useCurrentMember() {
  const { member, isLoading } = useAuth();
  return { data: member ?? undefined, isLoading };
}
