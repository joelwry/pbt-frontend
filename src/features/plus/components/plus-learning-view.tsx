"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import { tierMeetsRequirement } from "@/features/session/tier-rank";
import { SubscriptionGate } from "@/features/membership/components/subscription-gate";
import { TierLearningView } from "@/features/learning/components/tier-learning-view";

const TITLE = "PBT Plus Learning";
const DESCRIPTION = "Lessons reserved exclusively for PBT Plus members.";

export function PlusLearningView() {
  const { data: member, isLoading } = useCurrentMember();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title={TITLE} description={DESCRIPTION} />
        <Skeleton className="h-44 w-full rounded-[var(--radius-card)]" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="space-y-6">
        <PageHeader title={TITLE} description={DESCRIPTION} />
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!tierMeetsRequirement(member.membershipTier, "Plus")) {
    return (
      <div className="space-y-6">
        <PageHeader title={TITLE} description={DESCRIPTION} />
        <SubscriptionGate requiredTier="Plus" currentTier={member.membershipTier} />
      </div>
    );
  }

  return <TierLearningView contentTier="Plus" title={TITLE} description={DESCRIPTION} />;
}
