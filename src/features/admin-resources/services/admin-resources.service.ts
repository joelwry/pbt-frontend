import { adminResourcesRepository, type AdminResourcesQuery } from "@/features/admin-resources/repositories/admin-resources.repository";
import type { AdminResource, AdminResourcesStats } from "@/features/admin-resources/types";
import type { Pagination } from "@/types/api";

export interface AdminResourcesPage {
  items: AdminResource[];
  pagination: Pagination;
}

export const adminResourcesService = {
  async getStats(): Promise<AdminResourcesStats> {
    const response = await adminResourcesRepository.getStats();
    return response.data;
  },

  async getResourcesPage(query: AdminResourcesQuery): Promise<AdminResourcesPage> {
    const response = await adminResourcesRepository.getResourcesPage(query);
    return { items: response.data, pagination: response.pagination };
  },

  async getResourceById(id: string): Promise<AdminResource> {
    const response = await adminResourcesRepository.getResourceById(id);
    return response.data;
  },

  async saveResource(input: AdminResource): Promise<AdminResource> {
    const response = await adminResourcesRepository.saveResource(input);
    return response.data;
  },

  async deleteResource(id: string): Promise<boolean> {
    const response = await adminResourcesRepository.deleteResource(id);
    return response.data.deleted;
  },
};
