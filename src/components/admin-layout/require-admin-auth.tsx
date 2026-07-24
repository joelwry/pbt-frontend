"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "@/providers/admin-auth-provider";
import { useToast } from "@/providers/toast-provider";
import { isAdminRouteAllowed } from "@/features/admin-auth/permissions";
import { Loader2 } from "lucide-react";

export function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const { admin, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/admin/login?returnTo=${encodeURIComponent(pathname)}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, pathname]);

  useEffect(() => {
    if (isAuthenticated && admin && !isAdminRouteAllowed(admin, pathname)) {
      toast({ variant: "warning", title: "You don't have access to that section", description: "Contact a Super Admin if you need broader access." });
      router.replace("/admin/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, admin, pathname]);

  if (!isAuthenticated || (admin && !isAdminRouteAllowed(admin, pathname))) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
      </div>
    );
  }

  return <>{children}</>;
}
