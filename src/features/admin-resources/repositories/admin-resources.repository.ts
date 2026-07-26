import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminResource, AdminResourceCategory, AdminResourcesStats, ResourceVisibility } from "@/features/admin-resources/types";

export class AdminResourceNotFoundError extends Error {}

export interface AdminResourcesQuery {
  category: AdminResourceCategory | "All";
  search: string;
  page: number;
  limit: number;
}

type BackendTier = "Pathway" | "Plus" | "Mentorship";

interface BackendAdminResource {
  id: string;
  title: string;
  category: AdminResourceCategory;
  fileType: AdminResource["fileType"];
  engagementLabel: string;
  status: AdminResource["status"];
  description: string;
  visibility: BackendTier;
  metaLabel: string;
  fileUrl: string;
}

function tierToVisibility(tier: BackendTier): ResourceVisibility {
  if (tier === "Mentorship") return "mentorship";
  if (tier === "Plus") return "plus-mentorship";
  return "all";
}

function visibilityToTier(v: ResourceVisibility): BackendTier {
  if (v === "mentorship") return "Mentorship";
  if (v === "plus-mentorship") return "Plus";
  return "Pathway";
}

function toAdminResource(r: BackendAdminResource): AdminResource {
  return {
    id: r.id,
    title: r.title,
    category: r.category,
    fileType: r.fileType,
    engagementLabel: r.engagementLabel,
    status: r.status,
    description: r.description,
    visibility: tierToVisibility(r.visibility),
    metaLabel: r.metaLabel,
    fileUrl: r.fileUrl,
  };
}

function toWritePayload(input: AdminResource) {
  return {
    title: input.title,
    category: input.category,
    fileType: input.fileType,
    description: input.description,
    requiredTier: visibilityToTier(input.visibility),
    isDraft: input.status === "Draft",
    metaLabel: input.metaLabel,
  };
}

export const adminResourcesRepository = {
  async getStats(): Promise<ApiSuccess<AdminResourcesStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminResourcesStats>>("/admin/resources/stats");
    return data;
  },

  async getResourcesPage(query: AdminResourcesQuery): Promise<ApiPaginated<AdminResource>> {
    const { data } = await adminApiClient.get<ApiPaginated<BackendAdminResource>>("/admin/resources", {
      params: { category: query.category, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return { success: true, data: data.data.map(toAdminResource), pagination: data.pagination };
  },

  async getResourceById(id: string): Promise<ApiSuccess<AdminResource>> {
    try {
      const { data } = await adminApiClient.get<ApiSuccess<BackendAdminResource>>(`/admin/resources/${id}`);
      return { success: true, message: data.message, data: toAdminResource(data.data) };
    } catch {
      throw new AdminResourceNotFoundError(`No resource found for id ${id}`);
    }
  },

  async saveResource(input: AdminResource): Promise<ApiSuccess<AdminResource>> {
    const payload = toWritePayload(input);
    const { data } = input.id
      ? await adminApiClient.patch<ApiSuccess<BackendAdminResource>>(`/admin/resources/${input.id}`, payload)
      : await adminApiClient.post<ApiSuccess<BackendAdminResource>>("/admin/resources", payload);
    return { success: true, message: data.message, data: toAdminResource(data.data) };
  },

  async deleteResource(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await adminApiClient.delete(`/admin/resources/${id}`);
    return { success: true, message: "Resource deleted", data: { deleted: true } };
  },

  async uploadFile(resourceId: string, file: File): Promise<AdminResource> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await adminApiClient.post<ApiSuccess<BackendAdminResource>>(
      `/admin/resources/${resourceId}/upload`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return toAdminResource(data.data);
  },
};
