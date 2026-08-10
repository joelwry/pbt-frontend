import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { Resource, FeaturedToolkit, ResourceCategory, ResourceFileType } from "@/features/resources/types";

export interface ResourcesQuery {
  category: ResourceCategory | "All";
  search: string;
  page: number;
  limit: number;
}

interface BackendResource {
  _id: string;
  title: string;
  type: ResourceCategory;
  fileType: ResourceFileType;
  metaLabel: string;
  fileUrl: string;
}

function toResource(r: BackendResource): Resource {
  return { id: r._id, title: r.title, category: r.type, fileType: r.fileType, metaLabel: r.metaLabel, downloadUrl: r.fileUrl };
}

function toFeaturedToolkit(r: BackendResource & { description: string }): FeaturedToolkit {
  return {
    id: r._id,
    badgeLabel: "Featured Toolkit",
    title: r.title,
    description: r.description,
    downloadUrl: r.fileUrl,
  };
}

export const resourcesRepository = {
  async getFeaturedToolkit(): Promise<ApiSuccess<FeaturedToolkit> | null> {
    try {
      const { data } = await apiClient.get<ApiSuccess<BackendResource & { description: string }>>("/resources/featured");
      return { success: true, message: data.message, data: toFeaturedToolkit(data.data) };
    } catch {
      // No resources exist yet — an honest empty state, not an error.
      return null;
    }
  },

  async getResourcesPage(query: ResourcesQuery): Promise<ApiPaginated<Resource>> {
    const { data } = await apiClient.get<ApiPaginated<BackendResource>>("/resources", {
      params: { type: query.category, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return { success: true, data: data.data.map(toResource), pagination: data.pagination };
  },

  /** Fire-and-forget download tracking — the actual file fetch is the plain href, this just records it happened. */
  async trackDownload(resourceId: string): Promise<void> {
    await apiClient.post(`/resources/${resourceId}/download`, {});
  },
};
