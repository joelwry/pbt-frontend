"use client";

import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminResourcesStats, useAdminResourcesPage } from "@/features/admin-resources/hooks/use-admin-resources";
import { AdminResourcesStatsRow } from "@/features/admin-resources/components/admin-resources-stats-row";
import { ResourcesToolbar } from "@/features/admin-resources/components/resources-toolbar";
import { ResourcesTable } from "@/features/admin-resources/components/resources-table";
import type { AdminResourceCategory } from "@/features/admin-resources/types";

export function ResourcesView() {
  const { data: stats, isLoading: statsLoading } = useAdminResourcesStats();
  const [category, setCategory] = useState<AdminResourceCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminResourcesPage(category, search, page);

  function handleCategoryChange(next: AdminResourceCategory | "All") {
    setCategory(next);
    setPage(1);
  }
  function handleSearchChange(next: string) {
    setSearch(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Resource Management" description="Upload and manage templates, guides, webinars and toolkits." />

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
        <AdminResourcesStatsRow stats={stats} />
      )}

      <ResourcesToolbar search={search} onSearchChange={handleSearchChange} category={category} onCategoryChange={handleCategoryChange} />

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
          <EmptyState icon={FolderOpen} title="No resources found" description="Try a different category or search term." />
        ) : (
          <>
            <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <ResourcesTable resources={data.items} />
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
