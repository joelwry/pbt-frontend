"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/providers/toast-provider";
import { AuthProvider } from "@/providers/auth-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The member AuthProvider restores its session on mount by hitting
  // /auth/refresh-token via the member's httpOnly cookie -- on every page
  // load, no matter the route. Admin routes mount their own
  // AdminAuthProvider (admin/layout.tsx) against the separate
  // /auth/admin/refresh-token endpoint, so an admin visitor was firing both:
  // a real admin refresh attempt and a pointless member one that always
  // 401s. Skipping the member provider under /admin removes that second,
  // irrelevant request entirely.
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const content = <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return <ToastProvider>{isAdminRoute ? content : <AuthProvider>{content}</AuthProvider>}</ToastProvider>;
}
