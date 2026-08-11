"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminAuthService } from "@/features/admin-auth/services/admin-auth.service";
import { getAdminAuthErrorMessage } from "@/features/admin-auth/error-utils";
import { setAdminAccessToken as setStoredAdminAccessToken } from "@/lib/admin-access-token-store";
import { useToast } from "@/providers/toast-provider";
import type { AdminUser, AdminLoginCredentials } from "@/features/admin-auth/types";

interface AdminAuthState {
  admin: AdminUser | null;
  accessToken: string | null;
}

interface AdminAuthContextValue {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  /** True while the initial session-restore attempt (silent refresh from the httpOnly cookie) is in flight. */
  isLoading: boolean;
  login: (credentials: AdminLoginCredentials) => Promise<AdminUser>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const REFRESH_BUFFER_MS = 5000;

// Same hybrid strategy as the member AuthProvider: "memory" holds the
// refresh token in JS only (rememberDevice off), "persistent" relies solely
// on the httpOnly refresh cookie.
type SessionMode = "memory" | "persistent" | null;

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [state, setState] = useState<AdminAuthState>({ admin: null, accessToken: null });
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const refreshTokenRef = useRef<string | null>(null);
  const modeRef = useRef<SessionMode>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setAccessToken = useCallback((token: string | null) => {
    setStoredAdminAccessToken(token);
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
      const returnTo = pathname && pathname !== "/admin/login" ? pathname : undefined;
      refreshTokenRef.current = null;
      modeRef.current = null;
      setStoredAdminAccessToken(null);
      setState({ admin: null, accessToken: null });

      if (reason === "expired") {
        toast({ variant: "warning", title: "Your admin session has expired", description: "Please log in again to continue." });
      } else {
        toast({ variant: "info", title: "You've been logged out" });
      }

      router.push(returnTo ? `/admin/login?returnTo=${encodeURIComponent(returnTo)}` : "/admin/login");
    },
    [clearRefreshTimer, pathname, router, toast]
  );

  const scheduleRefreshRef = useRef<(expiresInSeconds: number) => void>(() => {});

  const scheduleRefresh = useCallback(
    (expiresInSeconds: number) => {
      clearRefreshTimer();
      const delay = Math.max(expiresInSeconds * 1000 - REFRESH_BUFFER_MS, 0);

      const runRefresh = async () => {
        const mode = modeRef.current;
        if (!mode) return;

        try {
          const refreshed = await adminAuthService.refresh(mode === "memory" ? refreshTokenRef.current : null);
          if (mode === "memory" && refreshed.refreshToken) {
            refreshTokenRef.current = refreshed.refreshToken;
          }
          setAccessToken(refreshed.accessToken);
          scheduleRefreshRef.current(refreshed.expiresIn);
        } catch {
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

  // On mount, try to restore a persistent admin session from the httpOnly
  // refresh cookie — same silent-by-design behavior as the member provider.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const session = await adminAuthService.restoreSession();
      if (cancelled) return;

      if (session) {
        modeRef.current = "persistent";
        refreshTokenRef.current = null;
        setStoredAdminAccessToken(session.accessToken);
        setState({ admin: session.admin, accessToken: session.accessToken });
        scheduleRefresh(session.expiresIn);
      }
      setIsBootstrapping(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (credentials: AdminLoginCredentials): Promise<AdminUser> => {
      try {
        const session = await adminAuthService.login(credentials);
        modeRef.current = credentials.rememberDevice ? "persistent" : "memory";
        refreshTokenRef.current = credentials.rememberDevice ? null : (session.refreshToken ?? null);
        setStoredAdminAccessToken(session.accessToken);
        setState({ admin: session.admin, accessToken: session.accessToken });
        scheduleRefresh(session.expiresIn);
        return session.admin;
      } catch (error) {
        toast({ variant: "error", title: "Couldn't sign you in", description: getAdminAuthErrorMessage(error) });
        throw error;
      }
    },
    [scheduleRefresh, toast]
  );

  const logout = useCallback(async () => {
    // Must await this *before* forceLogout clears the in-memory access
    // token -- see the matching comment in providers/auth-provider.tsx for
    // the full explanation. Same bug, same fix, both portals.
    await adminAuthService.logout().catch(() => {});
    forceLogout("manual");
  }, [forceLogout]);

  return (
    <AdminAuthContext.Provider
      value={{
        admin: state.admin,
        isAuthenticated: Boolean(state.admin),
        isLoading: isBootstrapping,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
