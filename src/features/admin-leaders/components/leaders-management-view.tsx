"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminLeadersStats, useAdminLeadersPage } from "@/features/admin-leaders/hooks/use-admin-leaders";
import { AdminLeadersStatsRow } from "@/features/admin-leaders/components/admin-leaders-stats-row";
import { LeadersToolbar } from "@/features/admin-leaders/components/leaders-toolbar";
import { LeadersTable } from "@/features/admin-leaders/components/leaders-table";
import type { AdminLeaderRegion } from "@/features/admin-leaders/types";

export function LeadersManagementView() {
  const { data: stats, isLoading: statsLoading } = useAdminLeadersStats();
  const [region, setRegion] = useState<AdminLeaderRegion | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminLeadersPage(region, search, page);

  function handleRegionChange(next: AdminLeaderRegion | "All") {
    setRegion(next);
    setPage(1);
  }
  function handleSearchChange(next: string) {
    setSearch(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="PBT Leaders Management" description="Manage the PBT Leaders directory and member assignments." />

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
        <AdminLeadersStatsRow stats={stats} />
      )}

      <LeadersToolbar search={search} onSearchChange={handleSearchChange} region={region} onRegionChange={handleRegionChange} />

      <Card>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : isError || !data ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={MapPin} title="No leaders found" description="Try a different region or search term." />
        ) : (
          <>
            <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <LeadersTable leaders={data.items} />
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border flex-wrap gap-3">
              <p className="text-sm text-text-muted">
                Showing {data.items.length} of {data.pagination.totalItems}
              </p>
              <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
