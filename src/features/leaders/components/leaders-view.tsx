"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { RegionTabs } from "@/components/shared/region-tabs";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeadersFeed } from "@/features/leaders/hooks/use-leaders";
import { LeaderCard } from "@/features/leaders/components/leader-card";
import type { LeaderRegion } from "@/features/leaders/types";

const REGIONS: readonly LeaderRegion[] = ["North West", "Midlands", "London & South East", "Scotland"];

export function LeadersView() {
  const [region, setRegion] = useState<LeaderRegion | "All">("All");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useLeadersFeed(
    region,
    search
  );

  const leaders = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.pagination.totalItems;

  return (
    <div className="space-y-6">
      <PageHeader title="PBT Leaders" description="Connect with PBT Leaders closest to your location." />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <RegionTabs regions={REGIONS} active={region} onSelect={setRegion} />
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leaders by name or area"
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto mt-3" />
              <Skeleton className="h-3 w-16 mx-auto mt-2" />
            </Card>
          ))}
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : leaders.length === 0 ? (
        <EmptyState icon={Users} title="No leaders found" description="Try a different region or search term." />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {leaders.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </div>
          <LoadMoreButton
            hasMore={Boolean(hasNextPage)}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            loadedLabel={totalCount ? `Showing ${leaders.length} of ${totalCount} leaders` : undefined}
          />
        </>
      )}
    </div>
  );
}
