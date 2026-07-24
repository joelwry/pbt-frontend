import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminEvent, AdminEventsStats, EventFilterTab } from "@/features/admin-events/types";
import { adminEventsStatsMock, adminEventsMock } from "@/features/admin-events/mocks/admin-events.mock";

const SIMULATED_LATENCY_MS = 500;
const eventsStore: AdminEvent[] = [...adminEventsMock];

export class AdminEventNotFoundError extends Error {}

export interface AdminEventsQuery {
  tab: EventFilterTab;
  search: string;
  page: number;
  limit: number;
  todayIso: string;
}

export const adminEventsRepository = {
  async getStats(): Promise<ApiSuccess<AdminEventsStats>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return adminEventsStatsMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AdminEventsStats>>("/admin/events/stats");
    // return data;
  },

  async getEventsPage(query: AdminEventsQuery): Promise<ApiPaginated<AdminEvent>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    let filtered = eventsStore.filter((e) => !q || e.title.toLowerCase().includes(q));

    if (query.tab === "Upcoming") filtered = filtered.filter((e) => e.date >= query.todayIso);
    else if (query.tab === "Past") filtered = filtered.filter((e) => e.date < query.todayIso);
    else filtered = filtered.filter((e) => e.type === query.tab);

    filtered = [...filtered].sort((a, b) =>
      query.tab === "Past" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    );

    const start = (query.page - 1) * query.limit;
    const items = filtered.slice(start, start + query.limit);
    const totalPages = Math.max(1, Math.ceil(filtered.length / query.limit));

    return {
      success: true,
      data: items,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalItems: filtered.length,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiPaginated<AdminEvent>>("/admin/events", { params: query });
    // return data;
  },

  async getEventById(id: string): Promise<ApiSuccess<AdminEvent>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const match = eventsStore.find((e) => e.id === id);
    if (!match) throw new AdminEventNotFoundError(`No event found for id ${id}`);
    return { success: true, message: "Event retrieved successfully", data: match };
  },

  async saveEvent(input: AdminEvent): Promise<ApiSuccess<AdminEvent>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const index = eventsStore.findIndex((e) => e.id === input.id);
    if (index >= 0) {
      eventsStore[index] = input;
    } else {
      eventsStore.unshift(input);
    }
    return { success: true, message: "Event saved successfully", data: input };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.put<ApiSuccess<AdminEvent>>(`/admin/events/${input.id}`, input);
    // return data;
  },

  async cancelEvent(id: string): Promise<ApiSuccess<AdminEvent>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const event = eventsStore.find((e) => e.id === id);
    if (!event) throw new AdminEventNotFoundError(`No event found for id ${id}`);
    event.status = "Cancelled";
    return { success: true, message: "Event cancelled", data: event };
  },

  async deleteEvent(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = eventsStore.findIndex((e) => e.id === id);
    if (index === -1) throw new AdminEventNotFoundError(`No event found for id ${id}`);
    eventsStore.splice(index, 1);
    return { success: true, message: "Event deleted", data: { deleted: true } };
  },
};
