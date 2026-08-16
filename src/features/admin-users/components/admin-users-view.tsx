"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsersStats, useAdminAccountsPage } from "@/features/admin-users/hooks/use-admin-users";
import { AdminUsersStatsRow } from "@/features/admin-users/components/admin-users-stats-row";
import { AdminUsersToolbar } from "@/features/admin-users/components/admin-users-toolbar";
import { AdminUsersTable } from "@/features/admin-users/components/admin-users-table";
import type { AdminRole } from "@/features/admin-auth/types";

export function AdminUsersView({ initialRole }: { initialRole?: AdminRole }) {
  const { data: stats, isLoading: statsLoading } = useAdminUsersStats();
  const [role, setRole] = useState<AdminRole | "All">(initialRole ?? "All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminAccountsPage(role, search, page);

  function handleRoleChange(next: AdminRole | "All") {
    setRole(next);
    setPage(1);
  }
  function handleSearchChange(next: string) {
    setSearch(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Users & Roles" description="Manage who has access to the admin portal, and what they can do." />

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
        <AdminUsersStatsRow stats={stats} />
      )}

      <AdminUsersToolbar search={search} onSearchChange={handleSearchChange} role={role} onRoleChange={handleRoleChange} />

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
          <EmptyState icon={ShieldCheck} title="No admin users found" description="Try a different role filter or search term." />
        ) : (
          <>
            <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <AdminUsersTable accounts={data.items} />
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
