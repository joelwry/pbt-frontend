import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { calendarService } from "@/features/calendar/services/calendar.service";

export function useMonthEvents(yearMonth: string) {
  return useQuery({
    queryKey: ["calendar", "month", yearMonth],
    queryFn: () => calendarService.getMonthEvents(yearMonth),
  });
}

const UPCOMING_PAGE_SIZE = 3;

export function useUpcomingEventsFeed(fromDate: string) {
  return useInfiniteQuery({
    queryKey: ["calendar", "upcoming", fromDate],
    queryFn: ({ pageParam }) => calendarService.getUpcomingEventsPage(fromDate, pageParam, UPCOMING_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined),
  });
}
