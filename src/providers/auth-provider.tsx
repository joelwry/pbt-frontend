"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import { getAuthErrorMessage } from "@/features/auth/error-utils";
import { setAccessToken as setStoredAccessToken } from "@/lib/access-token-store";
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
  /** True while the initial session-restore attempt (silent refresh from the httpOnly cookie) is in flight. */
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

// "memory": refresh token held in JS memory, sent explicitly (rememberMe off).
// "persistent": no refresh token in JS at all — every refresh relies on the
// httpOnly cookie the backend reads automatically.
type SessionMode = "memory" | "persistent" | null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [state, setState] = useState<AuthState>({ member: null, accessToken: null });
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const refreshTokenRef = useRef<string | null>(null);
  const modeRef = useRef<SessionMode>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setAccessToken = useCallback((token: string | null) => {
    setStoredAccessToken(token);
    setState((prev) => ({ ...prev, accessToken: token }));
  }, []);

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
      modeRef.current = null;
      setStoredAccessToken(null);
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
        const mode = modeRef.current;
        if (!mode) return;

        try {
          const refreshed = await authService.refresh(mode === "memory" ? refreshTokenRef.current : null);
          if (mode === "memory" && refreshed.refreshToken) {
            refreshTokenRef.current = refreshed.refreshToken;
          }
          setAccessToken(refreshed.accessToken);
          scheduleRefreshRef.current(refreshed.expiresIn);
        } catch {
          // Refresh token itself is invalid/expired — the session cannot continue silently.
          forceLogout("expired");
        }
      };

      refreshTimerRef.current = setTimeout(runRefresh, delay);
    },
    [clearRefreshTimer, forceLogout, setAccessToken]
  );

  useEffect(() => {
    scheduleRefreshRef.current = scheduleRefresh;
  }, [scheduleRefresh]);

  // On mount, try to restore a persistent session from the httpOnly refresh
  // cookie. Most visitors won't have one (nothing to redirect, no toast) —
  // this is silent by design, unlike an expiring active session.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const session = await authService.restoreSession();
      if (cancelled) return;

      if (session) {
        modeRef.current = "persistent";
        refreshTokenRef.current = null;
        setStoredAccessToken(session.accessToken);
        setState({ member: session.member, accessToken: session.accessToken });
        scheduleRefresh(session.expiresIn);
      }
      setIsBootstrapping(false);
    })();

    return () => {
      cancelled = true;
    };
    // Runs once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<CurrentMember> => {
      try {
        const session = await authService.login(credentials);
        modeRef.current = credentials.rememberMe ? "persistent" : "memory";
        refreshTokenRef.current = credentials.rememberMe ? null : (session.refreshToken ?? null);
        setStoredAccessToken(session.accessToken);
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
    authService.logout().catch(() => {});
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
        isLoading: isBootstrapping,
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
