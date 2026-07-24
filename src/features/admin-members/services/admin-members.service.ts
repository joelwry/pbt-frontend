import { adminMembersRepository, type AdminMembersQuery } from "@/features/admin-members/repositories/admin-members.repository";
import type { MembershipTier } from "@/features/session/types";
import type { AdminMemberDetail, AdminMembersStats } from "@/features/admin-members/types";
import type { Pagination } from "@/types/api";

export interface AdminMembersPage {
  items: AdminMemberDetail[];
  pagination: Pagination;
}

export const adminMembersService = {
  async getStats(): Promise<AdminMembersStats> {
    const response = await adminMembersRepository.getStats();
    return response.data;
  },

  async getMembersPage(query: AdminMembersQuery): Promise<AdminMembersPage> {
    const response = await adminMembersRepository.getMembersPage(query);
    return { items: response.data, pagination: response.pagination };
  },

  async getMemberById(id: string): Promise<AdminMemberDetail> {
    const response = await adminMembersRepository.getMemberById(id);
    return response.data;
  },

  async changeTier(id: string, tier: MembershipTier): Promise<AdminMemberDetail> {
    const response = await adminMembersRepository.changeTier(id, tier);
    return response.data;
  },

  async setPaused(id: string, paused: boolean): Promise<AdminMemberDetail> {
    const response = await adminMembersRepository.setPaused(id, paused);
    return response.data;
  },

  async resendWelcomeEmail(id: string): Promise<boolean> {
    const response = await adminMembersRepository.resendWelcomeEmail(id);
    return response.data.sent;
  },

  async deactivateAccount(id: string): Promise<boolean> {
    const response = await adminMembersRepository.deactivateAccount(id);
    return response.data.deactivated;
  },

  async deleteMember(id: string): Promise<boolean> {
    const response = await adminMembersRepository.deleteMember(id);
    return response.data.deleted;
  },
};
