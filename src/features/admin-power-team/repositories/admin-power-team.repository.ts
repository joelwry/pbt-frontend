import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminPartner, AdminPartnerCategory, AdminPowerTeamStats } from "@/features/admin-power-team/types";

export class AdminPartnerNotFoundError extends Error {}

export interface AdminPartnersQuery {
  category: AdminPartnerCategory | "All";
  search: string;
  page: number;
  limit: number;
}

type BackendAdminPartner = AdminPartner & { id: string };

function toAdminPartner(p: BackendAdminPartner): AdminPartner {
  return {
    id: p.id,
    name: p.name,
    initials: p.initials,
    category: p.category,
    categoryLabel: p.categoryLabel,
    region: p.region,
    status: p.status,
    email: p.email,
    phone: p.phone,
    bio: p.bio,
    website: p.website,
    logoUrl: p.logoUrl,
  };
}

function toWritePayload(input: AdminPartner) {
  return {
    name: input.name,
    category: input.category,
    categoryLabel: input.categoryLabel,
    region: input.region,
    email: input.email,
    phone: input.phone,
    bio: input.bio,
    website: input.website,
    status: input.status,
  };
}

export const adminPowerTeamRepository = {
  async getStats(): Promise<ApiSuccess<AdminPowerTeamStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminPowerTeamStats>>("/admin/power-team/stats");
    return data;
  },

  async getPartnersPage(query: AdminPartnersQuery): Promise<ApiPaginated<AdminPartner>> {
    const { data } = await adminApiClient.get<ApiPaginated<BackendAdminPartner>>("/admin/power-team", {
      params: { category: query.category, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return { success: true, data: data.data.map(toAdminPartner), pagination: data.pagination };
  },

  async getPartnerById(id: string): Promise<ApiSuccess<AdminPartner>> {
    try {
      const { data } = await adminApiClient.get<ApiSuccess<BackendAdminPartner>>(`/admin/power-team/${id}`);
      return { success: true, message: data.message, data: toAdminPartner(data.data) };
    } catch {
      throw new AdminPartnerNotFoundError(`No partner found for id ${id}`);
    }
  },

  async savePartner(input: AdminPartner): Promise<ApiSuccess<AdminPartner>> {
    const payload = toWritePayload(input);
    const { data } = input.id
      ? await adminApiClient.patch<ApiSuccess<BackendAdminPartner>>(`/admin/power-team/${input.id}`, payload)
      : await adminApiClient.post<ApiSuccess<BackendAdminPartner>>("/admin/power-team", payload);
    return { success: true, message: data.message, data: toAdminPartner(data.data) };
  },

  async deletePartner(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await adminApiClient.delete(`/admin/power-team/${id}`);
    return { success: true, message: "Partner deleted", data: { deleted: true } };
  },

  async uploadLogo(partnerId: string, file: File): Promise<AdminPartner> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await adminApiClient.post<ApiSuccess<BackendAdminPartner>>(
      `/admin/power-team/${partnerId}/logo`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return toAdminPartner(data.data);
  },
};
