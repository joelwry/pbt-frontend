import { adminEventsRepository, type AdminEventsQuery } from "@/features/admin-events/repositories/admin-events.repository";
import type { AdminEvent, AdminEventsStats } from "@/features/admin-events/types";
import type { Pagination } from "@/types/api";

export interface AdminEventsPage {
  items: AdminEvent[];
  pagination: Pagination;
}

export const adminEventsService = {
  async getStats(): Promise<AdminEventsStats> {
    const response = await adminEventsRepository.getStats();
    return response.data;
  },

  async getEventsPage(query: AdminEventsQuery): Promise<AdminEventsPage> {
    const response = await adminEventsRepository.getEventsPage(query);
    return { items: response.data, pagination: response.pagination };
  },

  async getEventById(id: string): Promise<AdminEvent> {
    const response = await adminEventsRepository.getEventById(id);
    return response.data;
  },

  async saveEvent(input: AdminEvent): Promise<AdminEvent> {
    const response = await adminEventsRepository.saveEvent(input);
    return response.data;
  },

  async cancelEvent(id: string): Promise<AdminEvent> {
    const response = await adminEventsRepository.cancelEvent(id);
    return response.data;
  },

  async deleteEvent(id: string): Promise<boolean> {
    const response = await adminEventsRepository.deleteEvent(id);
    return response.data.deleted;
  },
};
