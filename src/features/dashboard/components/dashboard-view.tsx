"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { StatsRow } from "@/features/dashboard/components/stats-row";
import { RoadmapProgressCard } from "@/features/dashboard/components/roadmap-progress-card";
import { ContinueLearningCard } from "@/features/dashboard/components/continue-learning-card";
import { QuickAccessGrid } from "@/features/dashboard/components/quick-access-grid";
import { WorkshopsPromoCard } from "@/features/dashboard/components/workshops-promo-card";
import { UpcomingEventsCard } from "@/features/dashboard/components/upcoming-events-card";
import { CommunityActivityCard } from "@/features/dashboard/components/community-activity-card";
import { ConnectWithPbtCard } from "@/features/dashboard/components/connect-with-pbt-card";
import { FacebookGroupPromoCard } from "@/features/dashboard/components/facebook-group-promo-card";

export function DashboardView() {
  const { data, isLoading, isError, refetch } = useDashboard();
  const { data: member } = useCurrentMember();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Let's keep building your property business and legacy." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${member?.fullName.split(" ")[0] ?? data.memberFirstName}! 👋`}
        description="Let's keep building your property business and legacy."
      />

      <StatsRow stats={data.stats} />

      <WorkshopsPromoCard promo={data.workshopsPromo} memberTier={member?.membershipTier ?? "Pathway"} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <RoadmapProgressCard progress={data.roadmapProgress} />
          <ContinueLearningCard lesson={data.continueLearning} />
          <QuickAccessGrid tiles={data.quickAccess} />
        </div>

        <div className="space-y-6">
          <UpcomingEventsCard events={data.upcomingEvents} />
          <FacebookGroupPromoCard />
          <CommunityActivityCard items={data.communityActivity} />
          <ConnectWithPbtCard />
        </div>
      </div>
    </div>
  );
}
