"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import { getAuthErrorMessage } from "@/features/auth/error-utils";
import { useToast } from "@/providers/toast-provider";
import type { CurrentMember } from "@/features/session/types";
import type { LoginCredentials } from "@/features/auth/types";

interface AuthState {
  member: CurrentMember | null;
  accessToken: string | null;
}

interface AuthContextValue {
  member: CurrentMember | null;
  isAuthenticated: boolean;
  /** Kept for parity with the rest of the app's useQuery-shaped hooks. Always false — there is nothing to bootstrap since tokens live in memory only (see note below). */
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<CurrentMember>;
  logout: () => void;
  /** Patches the in-memory member record — e.g. after a successful subscription renewal, without requiring a re-login. */
  updateMember: (patch: Partial<CurrentMember>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Buffer before actual expiry to refresh proactively, so a request never
// races an about-to-expire token.
const REFRESH_BUFFER_MS = 5000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [state, setState] = useState<AuthState>({ member: null, accessToken: null });
  const refreshTokenRef = useRef<string | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const forceLogout = useCallback(
    (reason: "expired" | "manual") => {
      clearRefreshTimer();
      const returnTo = pathname && pathname !== "/login" ? pathname : undefined;
      refreshTokenRef.current = null;
      setState({ member: null, accessToken: null });

      if (reason === "expired") {
        toast({
          variant: "warning",
          title: "Your session has expired",
          description: "Please log in again to continue.",
        });
      } else {
        toast({ variant: "info", title: "You've been logged out" });
      }

      router.push(returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login");
    },
    [clearRefreshTimer, pathname, router, toast]
  );

  // Lets the scheduled timeout call the *latest* scheduleRefresh (which
  // changes identity whenever its deps change) without scheduleRefresh
  // needing to reference itself before it's declared.
  const scheduleRefreshRef = useRef<(expiresInSeconds: number) => void>(() => {});

  const scheduleRefresh = useCallback(
    (expiresInSeconds: number) => {
      clearRefreshTimer();
      const delay = Math.max(expiresInSeconds * 1000 - REFRESH_BUFFER_MS, 0);

      const runRefresh = async () => {
        const currentRefreshToken = refreshTokenRef.current;
        if (!currentRefreshToken) return;

        try {
          const refreshed = await authService.refresh(currentRefreshToken);
          setState((prev) => ({ ...prev, accessToken: refreshed.accessToken }));
          scheduleRefreshRef.current(refreshed.expiresIn);
        } catch {
          // Refresh token itself is invalid/expired — the session cannot continue silently.
          forceLogout("expired");
        }
      };

      refreshTimerRef.current = setTimeout(runRefresh, delay);
    },
    [clearRefreshTimer, forceLogout]
  );

  useEffect(() => {
    scheduleRefreshRef.current = scheduleRefresh;
  }, [scheduleRefresh]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<CurrentMember> => {
      try {
        const session = await authService.login(credentials);
        refreshTokenRef.current = session.refreshToken;
        setState({ member: session.member, accessToken: session.accessToken });
        scheduleRefresh(session.expiresIn);
        return session.member;
      } catch (error) {
        toast({ variant: "error", title: "Couldn't sign you in", description: getAuthErrorMessage(error) });
        throw error;
      }
    },
    [scheduleRefresh, toast]
  );

  const logout = useCallback(() => {
    if (refreshTokenRef.current) {
      authService.logout(refreshTokenRef.current).catch(() => {});
    }
    forceLogout("manual");
  }, [forceLogout]);

  const updateMember = useCallback((patch: Partial<CurrentMember>) => {
    setState((prev) => (prev.member ? { ...prev, member: { ...prev.member, ...patch } } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        member: state.member,
        isAuthenticated: Boolean(state.member),
        isLoading: false,
        login,
        logout,
        updateMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
