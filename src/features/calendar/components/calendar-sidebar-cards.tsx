import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import type { CalendarEvent, CalendarEventType } from "@/features/calendar/types";

const TYPE_DOT: Record<CalendarEventType, string> = {
  Mentorship: "bg-sky-500",
  "In-Person": "bg-orange-500",
  Masterclass: "bg-navy-900",
};

function formatDayMonth(iso: string) {
  const [, month, day] = iso.split("-");
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return { day, month: monthNames[Number(month) - 1] };
}

export function UpcomingSidebarCard({
  events,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: {
  events: CalendarEvent[];
  isLoading: boolean;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-4">Upcoming</h3>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No upcoming events" />
      ) : (
        <>
          <ul className="space-y-4">
            {events.map((event) => {
              const { day, month } = formatDayMonth(event.date);
              return (
                <li key={event.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center h-11 w-11 rounded-lg bg-sky-tint text-sky-600 shrink-0">
                    <span className="text-[10px] font-bold leading-none uppercase">{month}</span>
                    <span className="text-sm font-bold leading-none mt-0.5">{day}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-primary leading-snug">{event.title}</p>
                    <p className="text-xs text-text-muted mt-1">{event.timeLabel}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <LoadMoreButton hasMore={hasMore} isLoading={isLoadingMore} onClick={onLoadMore} />
        </>
      )}
    </Card>
  );
}

export function FilterByTypeCard() {
  const items: { label: string; dot: string }[] = [
    { label: "Mentorship Sessions", dot: TYPE_DOT.Mentorship },
    { label: "In-Person Meetups", dot: TYPE_DOT["In-Person"] },
    { label: "Masterclasses", dot: TYPE_DOT.Masterclass },
  ];

  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-4">Filter by Type</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2.5 text-sm text-text-secondary">
            <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />
            {item.label}
          </li>
        ))}
      </ul>
    </Card>
  );
}
