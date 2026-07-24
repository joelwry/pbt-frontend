"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminContentStats, useAdminLessonsPage } from "@/features/admin-content/hooks/use-admin-content";
import { AdminContentStatsRow } from "@/features/admin-content/components/admin-content-stats-row";
import { ContentToolbar } from "@/features/admin-content/components/content-toolbar";
import { LessonsTable } from "@/features/admin-content/components/lessons-table";

export function ContentManagementView() {
  const { data: stats, isLoading: statsLoading } = useAdminContentStats();
  const [year, setYear] = useState("2026");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminLessonsPage(year, search, page);

  function handleYearChange(next: string) {
    setYear(next);
    setPage(1);
  }
  function handleSearchChange(next: string) {
    setSearch(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Content Management" description="Manage the drip-fed learning schedule for every programme year." />

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
        <AdminContentStatsRow stats={stats} />
      )}

      <ContentToolbar search={search} onSearchChange={handleSearchChange} year={year} onYearChange={handleYearChange} />

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
          <EmptyState icon={GraduationCap} title="No lessons found" description="Try a different year or search term." />
        ) : (
          <>
            <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <LessonsTable lessons={data.items} />
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
