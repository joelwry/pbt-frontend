"use client";

import { useState } from "react";
import { CalendarX2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useEventsPage, useCancelRsvp } from "@/features/events/hooks/use-events";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import { EventCard } from "@/features/events/components/event-card";
import type { EventsTab } from "@/features/events/types";

const TABS: { value: EventsTab; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past Events" },
  { value: "my-rsvps", label: "My RSVPs" },
];

export function EventsView() {
  const [tab, setTab] = useState<EventsTab>("upcoming");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isFetching } = useEventsPage(tab, page);
  const { mutate: cancelRsvp, isPending, variables: pendingId } = useCancelRsvp();
  const { data: member } = useCurrentMember();

  function handleTabChange(next: EventsTab) {
    setTab(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Events" description="Mentorship sessions, meetups and masterclasses across the UK." />

      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTabChange(t.value)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              tab === t.value ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="!p-0 overflow-hidden">
              <Skeleton className="h-24 w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title={tab === "my-rsvps" ? "No RSVPs yet" : "No events found"}
          description={tab === "my-rsvps" ? "Events you RSVP to will show up here." : "Check back soon for new sessions."}
        />
      ) : (
        <>
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 transition-opacity",
              isFetching && "opacity-60"
            )}
          >
            {data.items.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                memberTier={member?.membershipTier ?? "Pathway"}
                isPast={tab === "past"}
                onCancelRsvp={(id) => cancelRsvp(id)}
                isPending={isPending && pendingId === event.id}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
