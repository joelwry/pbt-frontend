import { eventsRepository } from "@/features/events/repositories/events.repository";
import type { EventItem, EventsTab, RsvpDetails } from "@/features/events/types";
import type { Pagination } from "@/types/api";

export interface EventsPage {
  items: EventItem[];
  pagination: Pagination;
}

export const eventsService = {
  async getEventsPage(tab: EventsTab, todayIso: string, page: number, limit: number): Promise<EventsPage> {
    const response = await eventsRepository.getEventsPage(tab, todayIso, page, limit);
    return { items: response.data, pagination: response.pagination };
  },

  async submitRsvp(eventId: string, details: RsvpDetails): Promise<EventItem> {
    const response = await eventsRepository.submitRsvp(eventId, details);
    return response.data;
  },

  async cancelRsvp(eventId: string): Promise<EventItem> {
    const response = await eventsRepository.cancelRsvp(eventId);
    return response.data;
  },
};
