import { adminLeadersRepository, type AdminLeadersQuery } from "@/features/admin-leaders/repositories/admin-leaders.repository";
import type { AdminLeader, AdminLeadersStats } from "@/features/admin-leaders/types";
import type { Pagination } from "@/types/api";

export interface AdminLeadersPage {
  items: AdminLeader[];
  pagination: Pagination;
}

export const adminLeadersService = {
  async getStats(): Promise<AdminLeadersStats> {
    const response = await adminLeadersRepository.getStats();
    return response.data;
  },
  async getLeadersPage(query: AdminLeadersQuery): Promise<AdminLeadersPage> {
    const response = await adminLeadersRepository.getLeadersPage(query);
    return { items: response.data, pagination: response.pagination };
  },
  async getLeaderById(id: string): Promise<AdminLeader> {
    const response = await adminLeadersRepository.getLeaderById(id);
    return response.data;
  },
  async saveLeader(input: AdminLeader): Promise<AdminLeader> {
    const response = await adminLeadersRepository.saveLeader(input);
    return response.data;
  },
  async deleteLeader(id: string): Promise<boolean> {
    const response = await adminLeadersRepository.deleteLeader(id);
    return response.data.deleted;
  },
};
