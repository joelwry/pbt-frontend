"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import { useToast } from "@/providers/toast-provider";
import { Loader2 } from "lucide-react";

export function RequireActiveSubscription({ children }: { children: React.ReactNode }) {
  const { data: member } = useCurrentMember();
  const router = useRouter();
  const { toast } = useToast();
  const hasNotified = useRef(false);

  const isExpired = member?.subscriptionStatus === "expired";

  useEffect(() => {
    if (isExpired && !hasNotified.current) {
      hasNotified.current = true;
      toast({
        variant: "warning",
        title: "Your subscription has expired",
        description: "Renew now to regain access to the member portal.",
      });
      router.replace("/renew-subscription");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpired]);

  if (isExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
      </div>
    );
  }

  return <>{children}</>;
}
