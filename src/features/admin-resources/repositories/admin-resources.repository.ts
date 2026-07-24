import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminResource, AdminResourceCategory, AdminResourcesStats } from "@/features/admin-resources/types";
import { adminResourcesStatsMock, adminResourcesMock } from "@/features/admin-resources/mocks/admin-resources.mock";

const SIMULATED_LATENCY_MS = 500;
const resourcesStore: AdminResource[] = [...adminResourcesMock];

export class AdminResourceNotFoundError extends Error {}

export interface AdminResourcesQuery {
  category: AdminResourceCategory | "All";
  search: string;
  page: number;
  limit: number;
}

export const adminResourcesRepository = {
  async getStats(): Promise<ApiSuccess<AdminResourcesStats>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return adminResourcesStatsMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AdminResourcesStats>>("/admin/resources/stats");
    // return data;
  },

  async getResourcesPage(query: AdminResourcesQuery): Promise<ApiPaginated<AdminResource>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    const filtered = resourcesStore.filter((r) => {
      const matchesCategory = query.category === "All" || r.category === query.category;
      const matchesSearch = !q || r.title.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

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
    // const { data } = await apiClient.get<ApiPaginated<AdminResource>>("/admin/resources", { params: query });
    // return data;
  },

  async getResourceById(id: string): Promise<ApiSuccess<AdminResource>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const match = resourcesStore.find((r) => r.id === id);
    if (!match) throw new AdminResourceNotFoundError(`No resource found for id ${id}`);
    return { success: true, message: "Resource retrieved successfully", data: match };
  },

  async saveResource(input: AdminResource): Promise<ApiSuccess<AdminResource>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const index = resourcesStore.findIndex((r) => r.id === input.id);
    if (index >= 0) {
      resourcesStore[index] = input;
    } else {
      resourcesStore.unshift(input);
    }
    return { success: true, message: "Resource saved successfully", data: input };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.put<ApiSuccess<AdminResource>>(`/admin/resources/${input.id}`, input);
    // return data;
  },

  async deleteResource(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = resourcesStore.findIndex((r) => r.id === id);
    if (index === -1) throw new AdminResourceNotFoundError(`No resource found for id ${id}`);
    resourcesStore.splice(index, 1);
    return { success: true, message: "Resource deleted", data: { deleted: true } };
  },
};
