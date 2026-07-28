"use client";

import { useState } from "react";
import { Search, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedToolkit, useResourcesPage } from "@/features/resources/hooks/use-resources";
import { FeaturedToolkitBanner } from "@/features/resources/components/featured-toolkit-banner";
import { ResourceCard } from "@/features/resources/components/resource-card";
import type { ResourceCategory } from "@/features/resources/types";

const CATEGORIES: { value: ResourceCategory | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Download", label: "Downloads" },
  { value: "Template", label: "Templates" },
  { value: "Guide", label: "Guides" },
  { value: "Worksheet", label: "Worksheets" },
  { value: "Video", label: "Videos" },
  { value: "Checklist", label: "Checklists" },
  { value: "Toolkit", label: "Toolkits" },
];

export function ResourcesView() {
  const [category, setCategory] = useState<ResourceCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: toolkit, isLoading: toolkitLoading } = useFeaturedToolkit();
  const { data, isLoading, isError, refetch, isFetching } = useResourcesPage(category, search, page);

  function handleCategoryChange(next: ResourceCategory | "All") {
    setCategory(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Resources" description="Downloads, templates, guides, worksheets, videos and checklists to support every stage of your journey." />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => handleCategoryChange(c.value)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                category === c.value ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search resources"
            className="pl-10"
          />
        </div>
      </div>

      {toolkitLoading ? <Skeleton className="h-32 w-full rounded-[var(--radius-card)]" /> : toolkit && <FeaturedToolkitBanner toolkit={toolkit} />}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-11 w-11 rounded-xl" />
              <Skeleton className="h-4 w-32 mt-4" />
              <Skeleton className="h-3 w-20 mt-2" />
            </Card>
          ))}
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No resources found" description="Try a different category or search term." />
      ) : (
        <>
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 transition-opacity",
              isFetching && "opacity-60"
            )}
          >
            {data.items.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
