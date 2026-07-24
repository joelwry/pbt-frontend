import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { EventItem, EventsTab, RsvpDetails } from "@/features/events/types";
import { eventsMock } from "@/features/events/mocks/events.mock";

const SIMULATED_LATENCY_MS = 450;

const eventsStore: EventItem[] = [...eventsMock.data];

export class EventNotFoundError extends Error {}

export const eventsRepository = {
  async getEventsPage(tab: EventsTab, todayIso: string, page: number, limit: number): Promise<ApiPaginated<EventItem>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    let filtered = eventsStore;
    if (tab === "upcoming") filtered = eventsStore.filter((e) => e.date >= todayIso);
    if (tab === "past") filtered = eventsStore.filter((e) => e.date < todayIso);
    if (tab === "my-rsvps") filtered = eventsStore.filter((e) => e.rsvped);

    filtered = [...filtered].sort((a, b) => (tab === "past" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));

    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(filtered.length / limit));

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        totalItems: filtered.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiPaginated<EventItem>>("/events", { params: { tab, page, limit } });
    // return data;
  },

  async submitRsvp(eventId: string, details: RsvpDetails): Promise<ApiSuccess<EventItem>> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const event = eventsStore.find((e) => e.id === eventId);
    if (!event) throw new EventNotFoundError(`No event found for id ${eventId}`);
    event.rsvped = true;
    event.rsvpDetails = details;
    return { success: true, message: "RSVP confirmed", data: event };
  },

  async cancelRsvp(eventId: string): Promise<ApiSuccess<EventItem>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const event = eventsStore.find((e) => e.id === eventId);
    if (!event) throw new EventNotFoundError(`No event found for id ${eventId}`);
    event.rsvped = false;
    event.rsvpDetails = undefined;
    return { success: true, message: "RSVP cancelled", data: event };
  },
};
