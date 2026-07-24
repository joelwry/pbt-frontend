import { Clock, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RsvpDialog } from "@/features/events/components/rsvp-dialog";
import type { EventItem, EventCategory } from "@/features/events/types";

const CATEGORY_VARIANT: Record<EventCategory, "orange" | "sky" | "success" | "navy" | "outline"> = {
  Mentorship: "orange",
  "In-Person": "sky",
  Community: "success",
  Masterclass: "navy",
  Onboarding: "outline",
};

function formatDayMonth(iso: string) {
  const [, month, day] = iso.split("-");
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return { day, month: monthNames[Number(month) - 1] };
}

export function EventCard({
  event,
  onCancelRsvp,
  isPending,
  isPast,
}: {
  event: EventItem;
  onCancelRsvp: (id: string) => void;
  isPending: boolean;
  isPast: boolean;
}) {
  const { day, month } = formatDayMonth(event.date);

  return (
    <Card className="!p-0 overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-br from-navy-950 to-navy-900 px-4 pt-4 pb-8 flex items-start justify-between">
        <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-white/10 text-white shrink-0">
          <span className="text-[10px] font-bold leading-none uppercase">{month}</span>
          <span className="text-sm font-bold leading-none mt-0.5">{day}</span>
        </div>
        <Badge variant={CATEGORY_VARIANT[event.category]}>{event.category}</Badge>
      </div>

      <div className="p-4 -mt-4 flex-1 flex flex-col">
        <div className="bg-white rounded-xl p-0">
          <h4 className="font-display text-[15px] font-bold text-text-primary leading-snug">{event.title}</h4>
          <p className="inline-flex items-center gap-1.5 text-xs text-text-muted mt-2">
            <Clock className="h-3.5 w-3.5" />
            {event.timeLabel}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-text-muted mt-1">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </p>
          {event.rsvped && event.rsvpDetails && (
            <p className="text-[11px] text-text-muted mt-2">
              {event.rsvpDetails.guestCount} attending
              {event.rsvpDetails.notes ? " · notes added" : ""}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3">
          {isPast ? (
            <Button variant="secondary" size="sm" className="w-full" disabled>
              Event Ended
            </Button>
          ) : event.rsvped ? (
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => onCancelRsvp(event.id)}
              disabled={isPending}
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel RSVP
            </Button>
          ) : (
            <RsvpDialog
              event={event}
              trigger={
                <Button size="sm" className="w-full">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  RSVP Now
                </Button>
              }
            />
          )}
        </div>
      </div>
    </Card>
  );
}
