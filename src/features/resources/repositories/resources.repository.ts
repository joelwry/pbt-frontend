import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { Resource, FeaturedToolkit, ResourceCategory } from "@/features/resources/types";
import { resourcesMock, featuredToolkitMock } from "@/features/resources/mocks/resources.mock";

const SIMULATED_LATENCY_MS = 450;

export interface ResourcesQuery {
  category: ResourceCategory | "All";
  search: string;
  page: number;
  limit: number;
}

export const resourcesRepository = {
  async getFeaturedToolkit(): Promise<ApiSuccess<FeaturedToolkit>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return featuredToolkitMock;
  },

  async getResourcesPage(query: ResourcesQuery): Promise<ApiPaginated<Resource>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    const filtered = resourcesMock.data.filter((resource) => {
      const matchesCategory = query.category === "All" || resource.category === query.category;
      const matchesSearch = !q || resource.title.toLowerCase().includes(q);
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
    // const { data } = await apiClient.get<ApiPaginated<Resource>>("/resources", { params: query });
    // return data;
  },
};
