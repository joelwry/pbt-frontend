"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { useMonthEvents, useUpcomingEventsFeed } from "@/features/calendar/hooks/use-calendar";
import { formatYearMonth } from "@/features/calendar/date-utils";
import { MonthGrid } from "@/features/calendar/components/month-grid";
import { UpcomingSidebarCard, FilterByTypeCard } from "@/features/calendar/components/calendar-sidebar-cards";

function todayParts() {
  const now = new Date();
  return { year: now.getFullYear(), month0: now.getMonth(), iso: now.toISOString().slice(0, 10) };
}

export function CalendarView() {
  const today = todayParts();
  const [cursor, setCursor] = useState({ year: today.year, month0: today.month0 });

  const yearMonth = formatYearMonth(cursor.year, cursor.month0);
  const { data: monthEvents, isLoading: monthLoading, isError: monthError, refetch: refetchMonth } = useMonthEvents(yearMonth);

  const {
    data: upcomingFeed,
    isLoading: upcomingLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUpcomingEventsFeed(today.iso);

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

  const upcomingEvents = upcomingFeed?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="All your PBT sessions, meetups and masterclasses in one place." />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2">
          {monthError ? (
            <ErrorState onRetry={() => refetchMonth()} />
          ) : (
            <MonthGrid
              year={cursor.year}
              month0={cursor.month0}
              todayIso={today.iso}
              events={monthEvents ?? []}
              isLoading={monthLoading}
              onPrevMonth={() => goToMonth(-1)}
              onNextMonth={() => goToMonth(1)}
              onToday={() => setCursor({ year: today.year, month0: today.month0 })}
            />
          )}
        </div>

        <div className="space-y-6">
          <UpcomingSidebarCard
            events={upcomingEvents}
            isLoading={upcomingLoading}
            hasMore={Boolean(hasNextPage)}
            isLoadingMore={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
          <FilterByTypeCard />
        </div>
      </div>
    </div>
  );
}
