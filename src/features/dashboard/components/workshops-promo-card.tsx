"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Sparkles, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { tierMeetsRequirement } from "@/features/session/tier-rank";
import { useMonthEvents } from "@/features/calendar/hooks/use-calendar";
import { formatYearMonth } from "@/features/calendar/date-utils";
import { WorkshopCalendarModal } from "@/features/dashboard/components/workshop-calendar-modal";
import type { MembershipTier } from "@/features/session/types";
import type { WorkshopsPromo } from "@/features/dashboard/types";

const WORKSHOP_CATEGORIES = new Set(["Masterclass", "Mentorship"]);

/** A real, live sample of this month's schedule shape -- one small square per
 * day, workshop days lit up -- rather than a static illustration, so it's
 * never showing dates that don't actually exist. */
function MiniMonthStrip() {
  const now = new Date();
  const yearMonth = formatYearMonth(now.getFullYear(), now.getMonth());
  const { data: monthEvents, isLoading } = useMonthEvents(yearMonth);
  const workshopDays = useMemo(() => {
    const days = new Set<number>();
    (monthEvents ?? []).forEach((e) => {
      if (WORKSHOP_CATEGORIES.has(e.type)) days.add(Number(e.date.slice(8, 10)));
    });
    return days;
  }, [monthEvents]);

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  if (isLoading) {
    return <Skeleton className="h-6 w-full max-w-xs bg-white/10" />;
  }

  return (
    <div className="flex items-center gap-1 flex-wrap max-w-xs" aria-hidden>
      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
        <span
          key={day}
          className={
            workshopDays.has(day)
              ? "h-2.5 w-2.5 rounded-sm bg-orange-500"
              : "h-2.5 w-2.5 rounded-sm bg-white/15"
          }
        />
      ))}
    </div>
  );
}

export function WorkshopsPromoCard({ promo, memberTier }: { promo: WorkshopsPromo; memberTier: MembershipTier }) {
  const [modalOpen, setModalOpen] = useState(false);
  const hasAccess = tierMeetsRequirement(memberTier, promo.requiredTier);

  return (
    <Card className="relative overflow-hidden bg-linear-to-r from-navy-950 via-navy-900 to-sky-600 border-none !p-0">
      <div className="relative px-6 py-7 flex items-center justify-between gap-6 flex-wrap">
        <div className="max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-bold text-navy-950 uppercase tracking-wide mb-3">
            <Sparkles className="h-3 w-3" />
            New
          </span>
          <h3 className="font-display text-xl font-bold text-white leading-snug">
            {promo.upcomingCount > 0
              ? `${promo.upcomingCount} upcoming ${promo.upcomingCount === 1 ? "workshop is" : "workshops are"} now open for booking!`
              : "New workshops are coming soon."}
          </h3>
          {promo.nextWorkshopTitle && (
            <p className="text-sm text-white/70 mt-2 flex items-center gap-1.5">
              <CalendarClock className="h-3.5 w-3.5 shrink-0" />
              Next up: {promo.nextWorkshopTitle}
              {promo.nextWorkshopDateLabel ? ` — ${promo.nextWorkshopDateLabel}` : ""}
            </p>
          )}
          <div className="mt-4">
            <MiniMonthStrip />
            <p className="text-[11px] text-white/50 mt-1.5">This month&apos;s workshop schedule at a glance</p>
          </div>
        </div>

        <Button className="shrink-0 bg-orange-500 hover:bg-orange-600 text-navy-950" onClick={() => setModalOpen(true)}>
          Book Now
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <WorkshopCalendarModal open={modalOpen} onOpenChange={setModalOpen} hasAccess={hasAccess} />
    </Card>
  );
}
