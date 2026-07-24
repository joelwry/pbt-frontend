"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsStats } from "@/features/admin-analytics/hooks/use-admin-analytics";
import { AdminAnalyticsStatsRow } from "@/features/admin-analytics/components/admin-analytics-stats-row";
import { MemberGrowthCard } from "@/features/admin-analytics/components/member-growth-card";
import { MembersByTierCard } from "@/features/admin-analytics/components/members-by-tier-card";
import { ContentEngagementCard } from "@/features/admin-analytics/components/content-engagement-card";
import { EventAttendanceCard } from "@/features/admin-analytics/components/event-attendance-card";

export function AnalyticsReportsView() {
  const { data: stats, isLoading: statsLoading } = useAnalyticsStats();

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics & Reports" description="Platform-wide engagement, growth and revenue insights." />

      {statsLoading || !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-10 w-10 rounded-xl mb-4" />
              <Skeleton className="h-7 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </Card>
          ))}
        </div>
      ) : (
        <AdminAnalyticsStatsRow stats={stats} />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          <MemberGrowthCard />
        </div>
        <MembersByTierCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ContentEngagementCard />
        <EventAttendanceCard />
      </div>
    </div>
  );
}
