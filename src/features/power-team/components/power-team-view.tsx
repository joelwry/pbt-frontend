"use client";

import { useState } from "react";
import { Search, Handshake } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { RegionTabs } from "@/components/shared/region-tabs";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePartnersFeed } from "@/features/power-team/hooks/use-power-team";
import { PartnerCard } from "@/features/power-team/components/partner-card";
import type { PartnerCategory } from "@/features/power-team/types";

const CATEGORIES: readonly PartnerCategory[] = ["Solicitors", "Mortgage Brokers", "Accountants", "Surveyors", "Letting Agents"];

export function PowerTeamView() {
  const [category, setCategory] = useState<PartnerCategory | "All">("All");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = usePartnersFeed(
    category,
    search
  );

  const partners = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.pagination.totalItems;

  return (
    <div className="space-y-6">
      <PageHeader title="Power Team" description="Vetted professionals trusted by the PBT community." />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <RegionTabs regions={CATEGORIES} active={category} onSelect={setCategory} allLabel="All Services" />
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the power team"
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
      ) : partners.length === 0 ? (
        <EmptyState icon={Handshake} title="No partners found" description="Try a different service or search term." />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
          <LoadMoreButton
            hasMore={Boolean(hasNextPage)}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            loadedLabel={totalCount ? `Showing ${partners.length} of ${totalCount} partners` : undefined}
          />
        </>
      )}
    </div>
  );
}
