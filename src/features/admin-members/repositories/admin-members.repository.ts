import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { MembershipTier } from "@/features/session/types";
import type { AdminMemberDetail, AdminMembersStats, MemberBillingRow, MemberLearningProgress } from "@/features/admin-members/types";

export class AdminMemberNotFoundError extends Error {}

export interface AdminMembersQuery {
  tier: MembershipTier | "All";
  search: string;
  page: number;
  limit: number;
}

export const adminMembersRepository = {
  async getStats(): Promise<ApiSuccess<AdminMembersStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminMembersStats>>("/admin/members/stats");
    return data;
  },

  async getMembersPage(query: AdminMembersQuery): Promise<ApiPaginated<AdminMemberDetail>> {
    const { data } = await adminApiClient.get<ApiPaginated<AdminMemberDetail>>("/admin/members", {
      params: { tier: query.tier, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return data;
  },

  async getMemberById(id: string): Promise<ApiSuccess<AdminMemberDetail>> {
    try {
      const { data } = await adminApiClient.get<ApiSuccess<AdminMemberDetail>>(`/admin/members/${id}`);
      return data;
    } catch {
      throw new AdminMemberNotFoundError(`No member found for id ${id}`);
    }
  },

  async createMember(input: { fullName: string; email: string; tier: MembershipTier }): Promise<ApiSuccess<AdminMemberDetail>> {
    const { data } = await adminApiClient.post<ApiSuccess<AdminMemberDetail>>("/admin/members", input);
    return data;
  },

  async updateMember(
    id: string,
    input: { fullName?: string; phone?: string; location?: string; assignedLeaderId?: string | null }
  ): Promise<ApiSuccess<AdminMemberDetail>> {
    const { data } = await adminApiClient.patch<ApiSuccess<AdminMemberDetail>>(`/admin/members/${id}`, input);
    return data;
  },

  async changeTier(id: string, tier: MembershipTier): Promise<ApiSuccess<AdminMemberDetail>> {
    const { data } = await adminApiClient.patch<ApiSuccess<AdminMemberDetail>>(`/admin/members/${id}/tier`, { tier });
    return data;
  },

  async setPaused(id: string, paused: boolean): Promise<ApiSuccess<AdminMemberDetail>> {
    const { data } = await adminApiClient.patch<ApiSuccess<AdminMemberDetail>>(`/admin/members/${id}/pause`, { paused });
    return data;
  },

  async resendWelcomeEmail(id: string): Promise<ApiSuccess<{ sent: boolean }>> {
    const { data } = await adminApiClient.post<ApiSuccess<{ sent: boolean }>>(`/admin/members/${id}/resend-welcome`, {});
    return data;
  },

  async deactivateAccount(id: string): Promise<ApiSuccess<{ deactivated: boolean }>> {
    const { data } = await adminApiClient.post<ApiSuccess<{ deactivated: boolean }>>(`/admin/members/${id}/deactivate`, {});
    return data;
  },

  async deleteMember(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    const { data } = await adminApiClient.delete<ApiSuccess<{ deleted: boolean }>>(`/admin/members/${id}`);
    return data;
  },

  async getMemberBilling(id: string, page: number, limit: number): Promise<ApiPaginated<MemberBillingRow>> {
    const { data } = await adminApiClient.get<ApiPaginated<MemberBillingRow>>(`/admin/members/${id}/billing`, {
      params: { page, limit },
    });
    return data;
  },

  async getMemberLearningProgress(id: string): Promise<ApiSuccess<MemberLearningProgress>> {
    const { data } = await adminApiClient.get<ApiSuccess<MemberLearningProgress>>(`/admin/members/${id}/learning-progress`);
    return data;
  },
};
