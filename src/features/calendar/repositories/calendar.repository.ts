import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { CalendarEvent } from "@/features/calendar/types";
import { calendarEventsMock } from "@/features/calendar/mocks/calendar.mock";

const SIMULATED_LATENCY_MS = 400;

export const calendarRepository = {
  /** Only the events for the requested month are fetched — never the whole calendar. */
  async getMonthEvents(yearMonth: string): Promise<ApiSuccess<CalendarEvent[]>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const items = calendarEventsMock.data.filter((event) => event.date.startsWith(yearMonth));
    return { success: true, message: "Month events retrieved successfully", data: items };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<CalendarEvent[]>>("/calendar/events", { params: { month: yearMonth } });
    // return data;
  },

  async getUpcomingEventsPage(fromDate: string, page: number, limit: number): Promise<ApiPaginated<CalendarEvent>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const upcoming = calendarEventsMock.data.filter((event) => event.date >= fromDate).sort((a, b) => a.date.localeCompare(b.date));

    const start = (page - 1) * limit;
    const items = upcoming.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(upcoming.length / limit));

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        totalItems: upcoming.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiPaginated<CalendarEvent>>("/calendar/upcoming", { params: { from: fromDate, page, limit } });
    // return data;
  },
};
