"use client";

import { useMemo, useState } from "react";
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
import { useSiteSettings } from "@/features/site-settings/hooks/use-site-settings";
import { EventCard } from "@/features/events/components/event-card";

const WORKSHOP_CATEGORIES = new Set(["Masterclass", "Mentorship"]);

/**
 * A dedicated enrolment page for workshops -- reuses the same real Events
 * data/RSVP flow as the Events page (workshops ARE events, category
 * Masterclass/Mentorship), just filtered and framed as its own destination
 * for the Dashboard's "Book Now" flow, rather than a parallel booking system.
 */
export function WorkshopsView() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isFetching } = useEventsPage("upcoming", page);
  const { mutate: cancelRsvp, isPending, variables: pendingId } = useCancelRsvp();
  const { data: member } = useCurrentMember();
  const { workshopLabel } = useSiteSettings();

  const workshops = useMemo(() => (data?.items ?? []).filter((e) => WORKSHOP_CATEGORIES.has(e.category)), [data]);

  return (
    <div className="space-y-6">
      <PageHeader title={`${workshopLabel}s`} description={`Live masterclasses and mentorship ${workshopLabel.toLowerCase()}s — enrol below.`} />

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
      ) : workshops.length === 0 ? (
        <EmptyState icon={CalendarX2} title={`No ${workshopLabel.toLowerCase()}s scheduled`} description={`Check back soon for new ${workshopLabel.toLowerCase()} dates.`} />
      ) : (
        <>
          <div className={cn("grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 transition-opacity", isFetching && "opacity-60")}>
            {workshops.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                memberTier={member?.membershipTier ?? "Pathway"}
                isPast={false}
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
