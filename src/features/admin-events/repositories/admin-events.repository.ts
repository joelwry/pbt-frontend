import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminEvent, AdminEventsStats, AdminEventType, EventFilterTab, EventRsvpVisibility } from "@/features/admin-events/types";

export class AdminEventNotFoundError extends Error {}

export interface AdminEventsQuery {
  tab: EventFilterTab;
  search: string;
  page: number;
  limit: number;
  todayIso: string;
}

type BackendTier = "Pathway" | "Plus" | "Mentorship";

interface BackendAdminEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  category: AdminEventType;
  rsvpCount: number;
  capacity: number;
  status: AdminEvent["status"];
  location: string;
  description: string;
  requiredTier: BackendTier;
}

function tierToVisibility(tier: BackendTier): EventRsvpVisibility {
  if (tier === "Mentorship") return "mentorship";
  if (tier === "Plus") return "plus-mentorship";
  return "all";
}

function visibilityToTier(v: EventRsvpVisibility): BackendTier {
  if (v === "mentorship") return "Mentorship";
  if (v === "plus-mentorship") return "Plus";
  return "Pathway";
}

function toAdminEvent(e: BackendAdminEvent): AdminEvent {
  return {
    id: e.id,
    title: e.title,
    date: e.date.slice(0, 10),
    startTime: e.startTime,
    endTime: e.endTime,
    type: e.category,
    rsvpCount: e.rsvpCount,
    capacity: e.capacity,
    status: e.status,
    location: e.location,
    description: e.description,
    visibility: tierToVisibility(e.requiredTier),
  };
}

function toWritePayload(input: AdminEvent) {
  return {
    title: input.title,
    category: input.type,
    capacity: input.capacity,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    location: input.location,
    description: input.description,
    requiredTier: visibilityToTier(input.visibility),
  };
}

export const adminEventsRepository = {
  async getStats(): Promise<ApiSuccess<AdminEventsStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminEventsStats>>("/admin/events/stats");
    return data;
  },

  async getEventsPage(query: AdminEventsQuery): Promise<ApiPaginated<AdminEvent>> {
    const { data } = await adminApiClient.get<ApiPaginated<BackendAdminEvent>>("/admin/events", {
      params: { tab: query.tab, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return { success: true, data: data.data.map(toAdminEvent), pagination: data.pagination };
  },

  async getEventById(id: string): Promise<ApiSuccess<AdminEvent>> {
    try {
      const { data } = await adminApiClient.get<ApiSuccess<BackendAdminEvent>>(`/admin/events/${id}`);
      return { success: true, message: data.message, data: toAdminEvent(data.data) };
    } catch {
      throw new AdminEventNotFoundError(`No event found for id ${id}`);
    }
  },

  async saveEvent(input: AdminEvent): Promise<ApiSuccess<AdminEvent>> {
    const payload = toWritePayload(input);
    const { data } = input.id
      ? await adminApiClient.patch<ApiSuccess<BackendAdminEvent>>(`/admin/events/${input.id}`, payload)
      : await adminApiClient.post<ApiSuccess<BackendAdminEvent>>("/admin/events", payload);
    return { success: true, message: data.message, data: toAdminEvent(data.data) };
  },

  async cancelEvent(id: string): Promise<ApiSuccess<AdminEvent>> {
    const { data } = await adminApiClient.post<ApiSuccess<BackendAdminEvent>>(`/admin/events/${id}/cancel`, {});
    return { success: true, message: data.message, data: toAdminEvent(data.data) };
  },

  async deleteEvent(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await adminApiClient.delete(`/admin/events/${id}`);
    return { success: true, message: "Event deleted", data: { deleted: true } };
  },
};
