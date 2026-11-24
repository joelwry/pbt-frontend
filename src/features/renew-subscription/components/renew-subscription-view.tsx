"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandMark } from "@/components/shared/brand-mark";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { useRenewSubscription } from "@/features/renew-subscription/hooks/use-renew-subscription";
import { usePricing } from "@/features/pricing/hooks/use-pricing";
import { formatAmount } from "@/features/pricing/services/pricing.service";
import { MEMBERSHIP_TIERS } from "@/features/membership/tiers";

export function RenewSubscriptionView() {
  const { member, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { mutate, isPending } = useRenewSubscription();
  const { data: pricing, isLoading: pricingLoading } = usePricing();
  const isActive = member?.subscriptionStatus === "active";

  useEffect(() => {
    if (isActive) router.replace("/dashboard");
  }, [isActive, router]);

  if (!member || isActive) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
      </div>
    );
  }

  const tierDef = MEMBERSHIP_TIERS[member.membershipTier];

  function handleRenew() {
    if (!member) return;
    mutate(member.membershipTier, {
      onSuccess: (session) => {
        window.location.href = session.checkoutUrl;
      },
      onError: () => {
        toast({
          variant: "error",
          title: "Couldn't start checkout",
          description: "Please try again, or contact support if this keeps happening.",
        });
      },
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-14">
      <div className="flex items-center gap-3 mb-8">
        <BrandMark size={36} className="border border-border" />
        <p className="font-display text-sm font-bold text-text-primary leading-tight">
          Property Business
          <br />
          Training
        </p>
      </div>

      <Card className="w-full max-w-lg">
        <div className="h-14 w-14 rounded-2xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mx-auto">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="font-display text-xl font-bold text-text-primary text-center mt-4">
          Your membership has expired
        </h1>
        <p className="text-sm text-text-muted text-center mt-2 max-w-sm mx-auto leading-relaxed">
          Access to Learning, Community, Events and every other member area is paused until you renew. Your
          PBT {tierDef.label} plan lapsed on{" "}
          <span className="font-semibold text-text-primary">
            {new Date(member.subscriptionDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          .
        </p>

        <div className="rounded-xl border border-border bg-[#F5F8FA] px-5 py-4 mt-6 flex items-center justify-between">
          <div>
            <Badge variant="outline">{tierDef.label}</Badge>
            <p className="text-xs text-text-muted mt-2">{tierDef.contractLabel}</p>
          </div>
          <div className="text-right">
            {pricingLoading ? (
              <Skeleton className="h-7 w-16 ml-auto" />
            ) : (
              <p className="font-display text-xl font-bold text-text-primary">
                {formatAmount(pricing?.[member.membershipTier].monthly ?? 0)}
              </p>
            )}
            <p className="text-xs text-text-muted">+ VAT/month</p>
          </div>
        </div>

        <Button size="lg" className="w-full mt-6" onClick={handleRenew} disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          {isPending ? "Redirecting to Stripe…" : "Renew with Stripe Checkout"}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-text-muted mt-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          Payments are processed securely by Stripe — card details never touch this portal.
        </p>

        <button
          onClick={logout}
          className="w-full text-center text-sm text-text-muted hover:text-text-primary mt-6"
        >
          Log out instead
        </button>
      </Card>
    </div>
  );
}
