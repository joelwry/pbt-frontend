"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useAdminDashboard } from "@/features/admin-dashboard/hooks/use-admin-dashboard";
import { AdminStatsRow } from "@/features/admin-dashboard/components/admin-stats-row";
import { MembershipBreakdownCard } from "@/features/admin-dashboard/components/membership-breakdown-card";
import { RecentlyJoinedTable } from "@/features/admin-dashboard/components/recently-joined-table";
import { NeedsAttentionCard, UpcomingUnlocksCard } from "@/features/admin-dashboard/components/attention-and-unlocks-cards";

export function AdminDashboardView() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-10 w-10 rounded-xl mb-4" />
              <Skeleton className="h-7 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Here's what's happening across the PBT platform today." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${data.adminFirstName} 👋`}
        description="Here's what's happening across the PBT platform today."
      />

      <AdminStatsRow stats={data.stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <MembershipBreakdownCard breakdown={data.membershipBreakdown} />
          <RecentlyJoinedTable members={data.recentlyJoined} />
        </div>
        <div className="space-y-6">
          <NeedsAttentionCard items={data.needsAttention} />
          <UpcomingUnlocksCard unlocks={data.upcomingUnlocks} />
        </div>
      </div>
    </div>
  );
}
