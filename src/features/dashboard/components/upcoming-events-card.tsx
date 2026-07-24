import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarDays } from "lucide-react";
import type { UpcomingEvent } from "@/features/dashboard/types";

const FORMAT_VARIANT = {
  "Live Online": "success" as const,
  "In-Person": "sky" as const,
  Workshop: "orange" as const,
};

export function UpcomingEventsCard({ events }: { events: UpcomingEvent[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold text-text-primary">Upcoming Events</h3>
        <Link href="/events" className="text-xs font-semibold text-sky-600 hover:underline">
          View all →
        </Link>
      </div>

      {events.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No upcoming events" description="Check back soon for new sessions." />
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center justify-center h-11 w-11 rounded-lg bg-sky-tint text-sky-600 shrink-0">
                <span className="text-[10px] font-bold leading-none uppercase">{event.month}</span>
                <span className="text-sm font-bold leading-none mt-0.5">{event.day}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-text-primary leading-snug">{event.title}</p>
                  <Badge variant={FORMAT_VARIANT[event.format]} className="shrink-0">
                    {event.format}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-1">{event.timeLabel}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
