"use client";

import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useCommunityMeta, useDiscussionsFeed } from "@/features/community/hooks/use-community";
import { PinnedAnnouncementBanner } from "@/features/community/components/pinned-announcement-banner";
import { TrendingDiscussionsList } from "@/features/community/components/trending-discussions-list";
import {
  LeaderSpotlightCard,
  YourGroupsCard,
  CommunityGuidelinesCard,
} from "@/features/community/components/sidebar-cards";

export function CommunityView() {
  const { data: meta, isLoading: metaLoading, isError: metaError, refetch: refetchMeta } = useCommunityMeta();
  const {
    data: feed,
    isLoading: feedLoading,
    isError: feedError,
    refetch: refetchFeed,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDiscussionsFeed();

  const isLoading = metaLoading || feedLoading;
  const isError = metaError || feedError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Community" description="Discussions, announcements and groups across the PBT network." />
        <Skeleton className="h-40 w-full rounded-[var(--radius-card)]" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <Skeleton className="h-72 w-full" />
          </Card>
          <Card>
            <Skeleton className="h-72 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !meta || !feed) {
    return (
      <div className="space-y-6">
        <PageHeader title="Community" description="Discussions, announcements and groups across the PBT network." />
        <ErrorState
          onRetry={() => {
            refetchMeta();
            refetchFeed();
          }}
        />
      </div>
    );
  }

  const discussions = feed.pages.flatMap((page) => page.items);
  const totalCount = feed.pages[0]?.pagination.totalItems;

  return (
    <div className="space-y-6">
      <PageHeader title="Community" description="Discussions, announcements and groups across the PBT network." />

      {meta.pinnedAnnouncement && <PinnedAnnouncementBanner announcement={meta.pinnedAnnouncement} />}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          <TrendingDiscussionsList
            discussions={discussions}
            totalCount={totalCount}
            hasMore={Boolean(hasNextPage)}
            isLoadingMore={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </div>
        <div className="space-y-6">
          <LeaderSpotlightCard leader={meta.leaderSpotlight} />
          <YourGroupsCard groups={meta.groups} />
          <CommunityGuidelinesCard guidelinesUrl={meta.guidelinesUrl} />
        </div>
      </div>
    </div>
  );
}
