"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityStats, useFlaggedPosts } from "@/features/admin-community/hooks/use-admin-community";
import { AdminCommunityStatsRow } from "@/features/admin-community/components/admin-community-stats-row";
import { FlaggedForReviewCard } from "@/features/admin-community/components/flagged-for-review-card";
import { PinnedAnnouncementsCard } from "@/features/admin-community/components/pinned-announcements-card";
import { AllPostsCard, GroupsCard } from "@/features/admin-community/components/all-posts-and-groups";
import type { CommunityTab } from "@/features/admin-community/types";

export function CommunityManagementView() {
  const { data: stats, isLoading: statsLoading } = useCommunityStats();
  const { data: flagged } = useFlaggedPosts();
  const [tab, setTab] = useState<CommunityTab>("Flagged");

  const tabs: { value: CommunityTab; label: string; badge?: number }[] = [
    { value: "All Posts", label: "All Posts" },
    { value: "Pinned", label: "Pinned" },
    { value: "Flagged", label: "Flagged", badge: flagged?.length },
    { value: "Groups", label: "Groups" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Community Management" description="Moderate discussions, pin announcements and manage groups." />

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
        <AdminCommunityStatsRow stats={stats} />
      )}

      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              tab === t.value ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
            )}
          >
            {t.label}
            {typeof t.badge === "number" && t.badge > 0 && (
              <span
                className={cn(
                  "inline-flex items-center justify-center h-4.5 min-w-[18px] px-1 rounded-full text-[10px] font-bold",
                  tab === t.value ? "bg-white/20 text-white" : "bg-error text-white"
                )}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "Flagged" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div className="xl:col-span-2">
            <FlaggedForReviewCard />
          </div>
          <PinnedAnnouncementsCard />
        </div>
      )}

      {tab === "Pinned" && <PinnedAnnouncementsCard />}
      {tab === "All Posts" && <AllPostsCard />}
      {tab === "Groups" && <GroupsCard />}
    </div>
  );
}
