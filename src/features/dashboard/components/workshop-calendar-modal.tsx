"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Lock, ArrowRight, CalendarDays } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMonthEvents } from "@/features/calendar/hooks/use-calendar";
import { MonthGrid } from "@/features/calendar/components/month-grid";
import { formatYearMonth } from "@/features/calendar/date-utils";
import { useSiteSettings } from "@/features/site-settings/hooks/use-site-settings";

const WORKSHOP_CATEGORIES = new Set(["Masterclass", "Mentorship"]);

function todayParts() {
  const now = new Date();
  return { year: now.getFullYear(), month0: now.getMonth(), iso: now.toISOString().slice(0, 10) };
}

/**
 * Opened from the Dashboard's Book Now button -- previews an actual month
 * of real, live workshop dates (drawn from the same Event data the Calendar
 * page uses, not a static image) so a member can see the shape of the
 * schedule before deciding whether to enrol. Members below the required
 * tier see the same preview plus an unveiled upgrade message in place of
 * an enrol action, rather than being blocked from seeing it at all.
 */
export function WorkshopCalendarModal({
  open,
  onOpenChange,
  hasAccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasAccess: boolean;
}) {
  const { workshopLabel } = useSiteSettings();
  const today = todayParts();
  const [cursor, setCursor] = useState({ year: today.year, month0: today.month0 });
  const yearMonth = formatYearMonth(cursor.year, cursor.month0);
  const { data: monthEvents, isLoading } = useMonthEvents(yearMonth);

  const workshopEvents = useMemo(() => (monthEvents ?? []).filter((e) => WORKSHOP_CATEGORIES.has(e.type)), [monthEvents]);

  function goToMonth(delta: number) {
    setCursor((prev) => {
      let month0 = prev.month0 + delta;
      let year = prev.year;
      if (month0 < 0) {
        month0 = 11;
        year -= 1;
      } else if (month0 > 11) {
        month0 = 0;
        year += 1;
      }
      return { year, month0 };
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-sky-600" />
            {workshopLabel} Schedule Preview
          </DialogTitle>
          <DialogDescription>A real look at upcoming PBT {workshopLabel.toLowerCase()} dates, month by month.</DialogDescription>
        </DialogHeader>

        <MonthGrid
          year={cursor.year}
          month0={cursor.month0}
          todayIso={today.iso}
          events={workshopEvents}
          isLoading={isLoading}
          onPrevMonth={() => goToMonth(-1)}
          onNextMonth={() => goToMonth(1)}
          onToday={() => setCursor({ year: today.year, month0: today.month0 })}
        />

        {hasAccess ? (
          <Button asChild className="w-full">
            <Link href="/workshops">
              Enrol in a {workshopLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div className="rounded-xl bg-orange-tint px-4 py-4">
            <p className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-orange-600" />
              These {workshopLabel.toLowerCase()}s are exclusive to members who have upgraded to PBT Plus or the Masterplan Programme
            </p>
            <p className="text-sm text-text-secondary mt-1.5">
              Upgrade your membership to enrol in live {workshopLabel.toLowerCase()}s like these, plus everything else included at that tier.
            </p>
            <Button asChild className="w-full mt-3">
              <Link href="/my-subscription">
                Upgrade Your Membership
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
