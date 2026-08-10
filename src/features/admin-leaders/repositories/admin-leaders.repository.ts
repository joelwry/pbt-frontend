import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminLeader, AdminLeaderRegion, AdminLeadersStats } from "@/features/admin-leaders/types";

export class AdminLeaderNotFoundError extends Error {}

export interface AdminLeadersQuery {
  region: AdminLeaderRegion | "All";
  search: string;
  page: number;
  limit: number;
}

type BackendAdminLeader = AdminLeader & { id: string };

function toAdminLeader(l: BackendAdminLeader): AdminLeader {
  return {
    id: l.id,
    fullName: l.fullName,
    initials: l.initials,
    region: l.region,
    specialty: l.specialty,
    specialties: l.specialties,
    email: l.email,
    bio: l.bio,
    status: l.status,
    membersAssigned: l.membersAssigned,
    isTopMentor: l.isTopMentor,
    location: l.location,
    yearsActive: l.yearsActive,
    profileImageUrl: l.profileImageUrl,
  };
}

function toWritePayload(input: AdminLeader) {
  return {
    fullName: input.fullName,
    region: input.region,
    specialty: input.specialty,
    specialties: input.specialties,
    email: input.email,
    bio: input.bio,
    isActive: input.status === "Active",
    isTopMentor: input.isTopMentor ?? false,
    location: input.location,
    yearsActive: input.yearsActive,
  };
}

export const adminLeadersRepository = {
  async getStats(): Promise<ApiSuccess<AdminLeadersStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminLeadersStats>>("/admin/leaders/stats");
    return data;
  },

  async getLeadersPage(query: AdminLeadersQuery): Promise<ApiPaginated<AdminLeader>> {
    const { data } = await adminApiClient.get<ApiPaginated<BackendAdminLeader>>("/admin/leaders", {
      params: { region: query.region, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return { success: true, data: data.data.map(toAdminLeader), pagination: data.pagination };
  },

  async getLeaderById(id: string): Promise<ApiSuccess<AdminLeader>> {
    try {
      const { data } = await adminApiClient.get<ApiSuccess<BackendAdminLeader>>(`/admin/leaders/${id}`);
      return { success: true, message: data.message, data: toAdminLeader(data.data) };
    } catch {
      throw new AdminLeaderNotFoundError(`No leader found for id ${id}`);
    }
  },

  async saveLeader(input: AdminLeader): Promise<ApiSuccess<AdminLeader>> {
    const payload = toWritePayload(input);
    const { data } = input.id
      ? await adminApiClient.patch<ApiSuccess<BackendAdminLeader>>(`/admin/leaders/${input.id}`, payload)
      : await adminApiClient.post<ApiSuccess<BackendAdminLeader>>("/admin/leaders", payload);
    return { success: true, message: data.message, data: toAdminLeader(data.data) };
  },

  async deleteLeader(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await adminApiClient.delete(`/admin/leaders/${id}`);
    return { success: true, message: "Leader deleted", data: { deleted: true } };
  },

  async uploadPhoto(leaderId: string, file: File): Promise<AdminLeader> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await adminApiClient.post<ApiSuccess<BackendAdminLeader>>(
      `/admin/leaders/${leaderId}/photo`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return toAdminLeader(data.data);
  },
};
