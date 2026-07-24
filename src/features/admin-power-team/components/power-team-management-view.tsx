"use client";

import { useState } from "react";
import { Handshake } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPowerTeamStats, useAdminPartnersPage } from "@/features/admin-power-team/hooks/use-admin-power-team";
import { AdminPowerTeamStatsRow } from "@/features/admin-power-team/components/admin-power-team-stats-row";
import { PowerTeamToolbar } from "@/features/admin-power-team/components/power-team-toolbar";
import { PartnersTable } from "@/features/admin-power-team/components/partners-table";
import type { AdminPartnerCategory } from "@/features/admin-power-team/types";

export function PowerTeamManagementView() {
  const { data: stats, isLoading: statsLoading } = useAdminPowerTeamStats();
  const [category, setCategory] = useState<AdminPartnerCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminPartnersPage(category, search, page);

  function handleCategoryChange(next: AdminPartnerCategory | "All") {
    setCategory(next);
    setPage(1);
  }
  function handleSearchChange(next: string) {
    setSearch(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Power Team Management" description="Manage vetted solicitors, brokers, accountants and surveyors." />

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
        <AdminPowerTeamStatsRow stats={stats} />
      )}

      <PowerTeamToolbar search={search} onSearchChange={handleSearchChange} category={category} onCategoryChange={handleCategoryChange} />

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
          <EmptyState icon={Handshake} title="No partners found" description="Try a different category or search term." />
        ) : (
          <>
            <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <PartnersTable partners={data.items} />
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
