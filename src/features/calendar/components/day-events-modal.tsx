"use client";

import Link from "next/link";
import { Clock, MapPin, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CalendarEvent } from "@/features/calendar/types";

const CATEGORY_VARIANT: Record<CalendarEvent["type"], "orange" | "sky" | "success" | "navy" | "outline"> = {
  Mentorship: "orange",
  "In-Person": "sky",
  Community: "success",
  Masterclass: "navy",
  Onboarding: "outline",
};

function formatFullDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/**
 * Opened on double-click of any calendar day that has events -- not
 * time-gated, since browsing the calendar (past or future) is a different
 * action from RSVPing, which stays real-time-gated on the Events page.
 */
export function DayEventsModal({
  date,
  events,
  open,
  onOpenChange,
}: {
  date: string | null;
  events: CalendarEvent[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{date ? formatFullDate(date) : "Events"}</DialogTitle>
          <DialogDescription>
            {events.length} event{events.length === 1 ? "" : "s"} on this day.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event) => (
            <div key={event.id} className="rounded-xl border border-border p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-text-primary">{event.title}</p>
                <Badge variant={CATEGORY_VARIANT[event.type]}>{event.type}</Badge>
              </div>
              <p className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                <Clock className="h-3.5 w-3.5" />
                {event.timeLabel}
              </p>
              <p className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </p>
              {event.requiredTier !== "Pathway" && (
                <p className="inline-flex items-center gap-1.5 text-xs text-orange-600 font-medium">
                  <Lock className="h-3 w-3" />
                  Requires PBT {event.requiredTier}
                </p>
              )}
              <Button asChild variant="secondary" size="sm" className="w-full mt-1">
                <Link href={`/events`}>View in Events</Link>
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
