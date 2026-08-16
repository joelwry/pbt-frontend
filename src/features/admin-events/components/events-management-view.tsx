"use client";

import { useState } from "react";
import { Ticket } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminEventsStats, useAdminEventsPage } from "@/features/admin-events/hooks/use-admin-events";
import { AdminEventsStatsRow } from "@/features/admin-events/components/admin-events-stats-row";
import { EventsToolbar } from "@/features/admin-events/components/events-toolbar";
import { EventsTable } from "@/features/admin-events/components/events-table";
import type { EventFilterTab } from "@/features/admin-events/types";

export function EventsManagementView({ initialTab }: { initialTab?: EventFilterTab }) {
  const { data: stats, isLoading: statsLoading } = useAdminEventsStats();
  const [tab, setTab] = useState<EventFilterTab>(initialTab ?? "Upcoming");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminEventsPage(tab, search, page);

  function handleTabChange(next: EventFilterTab) {
    setTab(next);
    setPage(1);
  }
  function handleSearchChange(next: string) {
    setSearch(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Event Management" description="Create and manage live sessions, workshops and meetups." />

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
        <AdminEventsStatsRow stats={stats} />
      )}

      <EventsToolbar search={search} onSearchChange={handleSearchChange} tab={tab} onTabChange={handleTabChange} />

      <Card>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : isError || !data ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={Ticket} title="No events found" description="Try a different filter or search term." />
        ) : (
          <>
            <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <EventsTable events={data.items} />
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
