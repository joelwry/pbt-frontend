import { calendarRepository } from "@/features/calendar/repositories/calendar.repository";
import type { CalendarEvent } from "@/features/calendar/types";
import type { Pagination } from "@/types/api";

export interface UpcomingEventsPage {
  items: CalendarEvent[];
  pagination: Pagination;
}

export const calendarService = {
  async getMonthEvents(yearMonth: string): Promise<CalendarEvent[]> {
    const response = await calendarRepository.getMonthEvents(yearMonth);
    return response.data;
  },

  async getUpcomingEventsPage(fromDate: string, page: number, limit: number): Promise<UpcomingEventsPage> {
    const response = await calendarRepository.getUpcomingEventsPage(fromDate, page, limit);
    return { items: response.data, pagination: response.pagination };
  },
};
