"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { buildMonthGrid, formatMonthLabel } from "@/features/calendar/date-utils";
import type { CalendarEvent, CalendarEventType } from "@/features/calendar/types";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const TYPE_DOT: Record<CalendarEventType, string> = {
  Mentorship: "bg-sky-500",
  "In-Person": "bg-orange-500",
  Masterclass: "bg-navy-900",
};

interface MonthGridProps {
  year: number;
  month0: number;
  todayIso: string;
  events: CalendarEvent[];
  isLoading: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function MonthGrid({ year, month0, todayIso, events, isLoading, onPrevMonth, onNextMonth, onToday }: MonthGridProps) {
  const cells = buildMonthGrid(year, month0, todayIso);
  const eventsByDate = new Map<string, CalendarEvent[]>();
  events.forEach((event) => {
    const list = eventsByDate.get(event.date) ?? [];
    list.push(event);
    eventsByDate.set(event.date, list);
  });

  return (
    <Card className="!p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <h3 className="font-display text-lg font-semibold text-text-primary">{formatMonthLabel(year, month0)}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-[#F5F8FA]"
            aria-label="Previous month"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
          <button
            onClick={onNextMonth}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-[#F5F8FA]"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <Button variant="secondary" size="sm" onClick={onToday}>
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-border">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="py-2.5 text-center text-[11px] font-semibold text-text-muted border-b border-border">
            {wd}
          </div>
        ))}

        {isLoading
          ? Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="h-24 border-b border-r border-border p-2 last-of-type:border-r-0">
                <Skeleton className="h-4 w-4" />
              </div>
            ))
          : cells.map((cell, i) => {
              const dayEvents = eventsByDate.get(cell.date) ?? [];
              return (
                <div
                  key={cell.date + i}
                  className={cn(
                    "h-24 sm:h-28 border-b border-r border-border p-2 overflow-hidden",
                    (i + 1) % 7 === 0 && "border-r-0",
                    !cell.isCurrentMonth && "bg-[#FAFCFD]"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      cell.isToday
                        ? "bg-navy-900 text-white"
                        : cell.isCurrentMonth
                          ? "text-text-primary"
                          : "text-text-muted"
                    )}
                  >
                    {cell.day}
                  </span>
                  <div className="mt-1.5 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className="flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", TYPE_DOT[event.type])} />
                        <span className="text-[10px] text-text-secondary leading-tight truncate">{event.title}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-[10px] text-text-muted pl-3">+{dayEvents.length - 2} more</p>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </Card>
  );
}
