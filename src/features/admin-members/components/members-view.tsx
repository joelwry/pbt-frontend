"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminMembersStats, useAdminMembersPage } from "@/features/admin-members/hooks/use-admin-members";
import { AdminMembersStatsRow } from "@/features/admin-members/components/admin-members-stats-row";
import { MembersToolbar } from "@/features/admin-members/components/members-toolbar";
import { MembersTable } from "@/features/admin-members/components/members-table";
import type { MembershipTier } from "@/features/session/types";

export function MembersView() {
  const { data: stats, isLoading: statsLoading } = useAdminMembersStats();
  const [tier, setTier] = useState<MembershipTier | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminMembersPage(tier, search, page);

  function handleTierChange(next: MembershipTier | "All") {
    setTier(next);
    setPage(1);
  }

  function handleSearchChange(next: string) {
    setSearch(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Member Management" description="View and manage all PBT members across every tier." />

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
        <AdminMembersStatsRow stats={stats} />
      )}

      <MembersToolbar search={search} onSearchChange={handleSearchChange} tier={tier} onTierChange={handleTierChange} />

      <Card>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : isError || !data ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={Users} title="No members found" description="Try a different tier or search term." />
        ) : (
          <>
            <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <MembersTable members={data.items} />
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border flex-wrap gap-3">
              <p className="text-sm text-text-muted">
                Showing {data.items.length} of {data.pagination.totalItems.toLocaleString()}
              </p>
              <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
