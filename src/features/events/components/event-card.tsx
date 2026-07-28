import { Clock, MapPin, CheckCircle2, XCircle, Lock, Images, PlayCircle, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RsvpDialog } from "@/features/events/components/rsvp-dialog";
import { tierMeetsRequirement } from "@/features/session/tier-rank";
import type { MembershipTier } from "@/features/session/types";
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
  memberTier,
  onCancelRsvp,
  isPending,
  isPast,
}: {
  event: EventItem;
  memberTier: MembershipTier;
  onCancelRsvp: (id: string) => void;
  isPending: boolean;
  isPast: boolean;
}) {
  const { day, month } = formatDayMonth(event.date);
  const hasAccess = tierMeetsRequirement(memberTier, event.requiredTier);

  return (
    <Card className="!p-0 overflow-hidden flex flex-col h-full">
      <div className="bg-linear-to-br from-navy-950 to-navy-900 px-4 pt-4 pb-8 flex items-start justify-between">
        <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-white/10 text-white shrink-0">
          <span className="text-[10px] font-bold leading-none uppercase">{month}</span>
          <span className="text-sm font-bold leading-none mt-0.5">{day}</span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge variant={CATEGORY_VARIANT[event.category]}>{event.category}</Badge>
          {event.requiredTier !== "Pathway" && (
            <Badge variant="outline" className="bg-white/10 text-white border-white/20">
              <Lock className="h-3 w-3" />
              {event.requiredTier}
            </Badge>
          )}
        </div>
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

        {isPast && (event.photoGalleryUrl || event.recordingUrl || event.slidesUrl) && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {event.photoGalleryUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={event.photoGalleryUrl} target="_blank" rel="noopener noreferrer">
                  <Images className="h-3.5 w-3.5" />
                  Photo Gallery
                </a>
              </Button>
            )}
            {event.recordingUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={event.recordingUrl} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="h-3.5 w-3.5" />
                  Watch Replay
                </a>
              </Button>
            )}
            {event.slidesUrl && (
              <Button variant="secondary" size="sm" asChild>
                <a href={event.slidesUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-3.5 w-3.5" />
                  Slides
                </a>
              </Button>
            )}
          </div>
        )}

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
          ) : !hasAccess ? (
            <Button size="sm" variant="secondary" className="w-full" disabled>
              <Lock className="h-3.5 w-3.5" />
              Requires {event.requiredTier}
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
