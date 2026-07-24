import { resourcesRepository, type ResourcesQuery } from "@/features/resources/repositories/resources.repository";
import type { Resource, FeaturedToolkit } from "@/features/resources/types";
import type { Pagination } from "@/types/api";

export interface ResourcesPage {
  items: Resource[];
  pagination: Pagination;
}

export const resourcesService = {
  async getFeaturedToolkit(): Promise<FeaturedToolkit> {
    const response = await resourcesRepository.getFeaturedToolkit();
    return response.data;
  },

  async getResourcesPage(query: ResourcesQuery): Promise<ResourcesPage> {
    const response = await resourcesRepository.getResourcesPage(query);
    return { items: response.data, pagination: response.pagination };
  },
};
