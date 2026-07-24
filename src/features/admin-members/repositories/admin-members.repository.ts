import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { MembershipTier } from "@/features/session/types";
import type { AdminMemberDetail, AdminMembersStats } from "@/features/admin-members/types";
import { adminMembersMock, adminMembersStatsMock } from "@/features/admin-members/mocks/admin-members.mock";

const SIMULATED_LATENCY_MS = 500;
const membersStore: AdminMemberDetail[] = [...adminMembersMock];

export class AdminMemberNotFoundError extends Error {}

export interface AdminMembersQuery {
  tier: MembershipTier | "All";
  search: string;
  page: number;
  limit: number;
}

export const adminMembersRepository = {
  async getStats(): Promise<ApiSuccess<AdminMembersStats>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return adminMembersStatsMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AdminMembersStats>>("/admin/members/stats");
    // return data;
  },

  async getMembersPage(query: AdminMembersQuery): Promise<ApiPaginated<AdminMemberDetail>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    const filtered = membersStore.filter((m) => {
      const matchesTier = query.tier === "All" || m.tier === query.tier;
      const matchesSearch =
        !q || m.fullName.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.clientId.toLowerCase().includes(q);
      return matchesTier && matchesSearch;
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
    // const { data } = await apiClient.get<ApiPaginated<AdminMemberDetail>>("/admin/members", { params: query });
    // return data;
  },

  async getMemberById(id: string): Promise<ApiSuccess<AdminMemberDetail>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const match = membersStore.find((m) => m.id === id);
    if (!match) throw new AdminMemberNotFoundError(`No member found for id ${id}`);
    return { success: true, message: "Member retrieved successfully", data: match };
  },

  async changeTier(id: string, tier: MembershipTier): Promise<ApiSuccess<AdminMemberDetail>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const member = membersStore.find((m) => m.id === id);
    if (!member) throw new AdminMemberNotFoundError(`No member found for id ${id}`);
    member.tier = tier;
    member.contractLabel = tier === "Pathway" ? "No contract" : tier === "Plus" ? "6-mo contract" : "12-mo renewable";
    return { success: true, message: "Membership tier updated successfully", data: member };
  },

  async setPaused(id: string, paused: boolean): Promise<ApiSuccess<AdminMemberDetail>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const member = membersStore.find((m) => m.id === id);
    if (!member) throw new AdminMemberNotFoundError(`No member found for id ${id}`);
    member.status = paused ? "Paused" : "Active";
    return { success: true, message: paused ? "Membership paused" : "Membership resumed", data: member };
  },

  async resendWelcomeEmail(id: string): Promise<ApiSuccess<{ sent: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const member = membersStore.find((m) => m.id === id);
    if (!member) throw new AdminMemberNotFoundError(`No member found for id ${id}`);
    return { success: true, message: "Welcome email sent", data: { sent: true } };
  },

  async deactivateAccount(id: string): Promise<ApiSuccess<{ deactivated: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const index = membersStore.findIndex((m) => m.id === id);
    if (index === -1) throw new AdminMemberNotFoundError(`No member found for id ${id}`);
    membersStore[index] = { ...membersStore[index], status: "Paused" };
    return { success: true, message: "Account deactivated", data: { deactivated: true } };
  },

  async deleteMember(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const index = membersStore.findIndex((m) => m.id === id);
    if (index === -1) throw new AdminMemberNotFoundError(`No member found for id ${id}`);
    membersStore.splice(index, 1);
    return { success: true, message: "Member deleted", data: { deleted: true } };
  },
};
