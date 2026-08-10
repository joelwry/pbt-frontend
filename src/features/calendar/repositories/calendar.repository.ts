import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { CalendarEvent } from "@/features/calendar/types";

interface BackendEventItem {
  id: string;
  date: string; // full ISO datetime
  title: string;
  timeLabel: string;
  location: string;
  category: CalendarEvent["type"];
  requiredTier: CalendarEvent["requiredTier"];
}

function toCalendarEvent(e: BackendEventItem): CalendarEvent {
  return {
    id: e.id,
    date: e.date.slice(0, 10),
    title: e.title,
    timeLabel: e.timeLabel,
    type: e.category,
    location: e.location,
    requiredTier: e.requiredTier,
  };
}

export const calendarRepository = {
  /** Only the events for the requested month are fetched — never the whole calendar. */
  async getMonthEvents(yearMonth: string): Promise<ApiSuccess<CalendarEvent[]>> {
    const [year, month] = yearMonth.split("-");
    const { data } = await apiClient.get<ApiSuccess<BackendEventItem[]>>("/events/calendar", { params: { year, month } });
    return { success: true, message: data.message, data: data.data.map(toCalendarEvent) };
  },

  async getUpcomingEventsPage(_fromDate: string, page: number, limit: number): Promise<ApiPaginated<CalendarEvent>> {
    const { data } = await apiClient.get<ApiPaginated<BackendEventItem>>("/events/upcoming", { params: { page, limit } });
    return { success: true, data: data.data.map(toCalendarEvent), pagination: data.pagination };
  },
};
