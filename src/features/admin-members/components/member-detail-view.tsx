"use client";

import { useState } from "react";
import { BackLink } from "@/components/shared/back-link";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminMember } from "@/features/admin-members/hooks/use-admin-members";
import { MemberProfileBanner } from "@/features/admin-members/components/member-profile-banner";
import { MemberDetailStatsRow } from "@/features/admin-members/components/member-detail-stats-row";
import { AccountInformationCard } from "@/features/admin-members/components/account-information-card";
import { AdminActionsCard } from "@/features/admin-members/components/admin-actions-card";
import { RecentActivityCard, MemberDetailTabs, type MemberDetailTab } from "@/features/admin-members/components/member-detail-shared";
import { LearningProgressTab, BillingHistoryTab } from "@/features/admin-members/components/member-detail-secondary-tabs";
import { ActivityLogTab } from "@/features/admin-members/components/activity-log-tab";

export function MemberDetailView({ memberId, initialTab }: { memberId: string; initialTab?: MemberDetailTab }) {
  const { data: member, isLoading, isError, refetch } = useAdminMember(memberId);
  const [tab, setTab] = useState<MemberDetailTab>(initialTab ?? "overview");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-28 w-full rounded-[var(--radius-card)]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-16 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !member) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <BackLink href="/admin/members" label="Back to Members" />
      <MemberProfileBanner member={member} />

      <MemberDetailTabs active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="space-y-6">
          <MemberDetailStatsRow member={member} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <AccountInformationCard member={member} />
            </div>
            <AdminActionsCard member={member} />
          </div>
          <RecentActivityCard items={member.recentActivity} />
        </div>
      )}

      {tab === "learning" && <LearningProgressTab member={member} />}
      {tab === "billing" && <BillingHistoryTab member={member} />}
      {tab === "activity" && <ActivityLogTab member={member} />}
    </div>
  );
}
