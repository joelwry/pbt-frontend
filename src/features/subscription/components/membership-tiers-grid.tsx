"use client";

import { Check, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import { useChangeTierCheckout } from "@/features/subscription/hooks/use-subscription";
import { usePricing } from "@/features/pricing/hooks/use-pricing";
import { formatAmount } from "@/features/pricing/services/pricing.service";
import { MEMBERSHIP_TIERS, TIER_ORDER } from "@/features/membership/tiers";
import type { MembershipTier } from "@/features/session/types";

export function MembershipTiersGrid({
  currentTier,
  currentAmountLabel,
}: {
  currentTier: MembershipTier;
  /** The member's actual locked-in rate for their current plan -- can differ from today's list price below if pricing changed since they joined (a real, honest grandfathered rate, not a bug). */
  currentAmountLabel: string;
}) {
  const { toast } = useToast();
  const { mutate, isPending, variables } = useChangeTierCheckout();
  const { data: pricing, isLoading: pricingLoading } = usePricing();

  function handleSwitchTier(tier: MembershipTier) {
    mutate(
      { tier, billingCycle: "monthly" },
      {
        onSuccess: (checkoutUrl) => {
          window.location.href = checkoutUrl;
        },
        onError: () => {
          toast({
            variant: "error",
            title: "Couldn't start checkout",
            description: "Please try again, or contact support if this keeps happening.",
          });
        },
      }
    );
  }

  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-4">Membership Tiers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TIER_ORDER.map((tier) => {
          const def = MEMBERSHIP_TIERS[tier];
          const isCurrent = tier === currentTier;
          const currentIndex = TIER_ORDER.indexOf(currentTier);
          const tierIndex = TIER_ORDER.indexOf(tier);
          const isUpgrade = tierIndex > currentIndex;
          const isPendingThisTier = isPending && variables?.tier === tier;

          return (
            <Card key={tier} className={cn("flex flex-col", isCurrent && "border-2 border-orange-500")}>
              {isCurrent && (
                <Badge variant="orange" className="mb-3 self-start">
                  Current Plan
                </Badge>
              )}
              <Badge variant={isCurrent ? "sky" : "outline"} className="mb-3 self-start">
                {def.label}
              </Badge>
              {isCurrent ? (
                <>
                  <p className="font-display text-2xl font-bold text-text-primary">{currentAmountLabel}</p>
                  <p className="text-xs text-text-muted mt-0.5">Your current rate</p>
                </>
              ) : pricingLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <p className="font-display text-2xl font-bold text-text-primary">
                    {formatAmount(pricing?.[tier].monthly ?? 0)}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">+ VAT/month at today&apos;s price</p>
                </>
              )}
              <p className="text-xs text-text-muted mt-3">{def.contractLabel}</p>
              <ul className="space-y-2 mt-4 flex-1">
                {def.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {!isCurrent && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full mt-5"
                  onClick={() => handleSwitchTier(tier)}
                  disabled={isPending}
                >
                  {isPendingThisTier ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isUpgrade ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {isPendingThisTier ? "Redirecting to Stripe…" : isUpgrade ? `Upgrade to ${def.label}` : `Switch to ${def.label}`}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
