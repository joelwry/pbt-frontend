import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { EventItem, EventsTab, RsvpDetails } from "@/features/events/types";

interface BackendEventItem {
  id: string;
  date: string; // full ISO datetime
  title: string;
  timeLabel: string;
  location: string;
  category: EventItem["category"];
  requiredTier: EventItem["requiredTier"];
  rsvped: boolean;
  rsvpDetails?: RsvpDetails;
}

function toEventItem(e: BackendEventItem): EventItem {
  return { ...e, date: e.date.slice(0, 10) };
}

const TAB_ENDPOINT: Record<EventsTab, string> = {
  upcoming: "/events/upcoming",
  past: "/events/past",
  "my-rsvps": "/events/my-rsvps",
};

export const eventsRepository = {
  async getEventsPage(tab: EventsTab, _todayIso: string, page: number, limit: number): Promise<ApiPaginated<EventItem>> {
    const { data } = await apiClient.get<ApiPaginated<BackendEventItem>>(TAB_ENDPOINT[tab], { params: { page, limit } });
    return { success: true, data: data.data.map(toEventItem), pagination: data.pagination };
  },

  async submitRsvp(eventId: string, details: RsvpDetails): Promise<ApiSuccess<EventItem>> {
    const { data } = await apiClient.post<ApiSuccess<BackendEventItem>>(`/events/${eventId}/rsvp`, details);
    return { success: true, message: data.message, data: toEventItem(data.data) };
  },

  async cancelRsvp(eventId: string): Promise<ApiSuccess<EventItem>> {
    const { data } = await apiClient.delete<ApiSuccess<BackendEventItem>>(`/events/${eventId}/rsvp`);
    return { success: true, message: data.message, data: toEventItem(data.data) };
  },
};
