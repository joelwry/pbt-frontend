"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import { useSubscription } from "@/features/subscription/hooks/use-subscription";
import { SubscriptionHeroCard } from "@/features/subscription/components/subscription-hero-card";
import { SubscriptionActionsCard } from "@/features/subscription/components/subscription-actions-card";
import { MembershipTiersGrid } from "@/features/subscription/components/membership-tiers-grid";
import { BillingHistoryTable } from "@/features/subscription/components/billing-history-table";

export function SubscriptionView() {
  const { data: subscription, isLoading, isError, refetch } = useSubscription();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Subscription" description="Manage your plan, billing and Client ID." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-44 lg:col-span-2 rounded-[var(--radius-card)]" />
          <Card>
            <Skeleton className="h-32 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !subscription) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Subscription" description="Manage your plan, billing and Client ID." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Subscription" description="Manage your plan, billing and Client ID." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <SubscriptionHeroCard subscription={subscription} />
        </div>
        <SubscriptionActionsCard
          subscription={subscription}
          onCancelled={() => {
            toast({
              variant: "info",
              title: "Cancellation scheduled",
              description: `You'll keep access until ${subscription.nextBillingLabel}.`,
            });
          }}
        />
      </div>

      <MembershipTiersGrid currentTier={subscription.tier} />

      <BillingHistoryTable />
    </div>
  );
}
