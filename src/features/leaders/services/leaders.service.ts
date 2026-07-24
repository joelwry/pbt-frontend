import { leadersRepository, type LeadersQuery } from "@/features/leaders/repositories/leaders.repository";
import type { Leader } from "@/features/leaders/types";
import type { Pagination } from "@/types/api";

export interface LeadersPage {
  items: Leader[];
  pagination: Pagination;
}

export const leadersService = {
  async getLeadersPage(query: LeadersQuery): Promise<LeadersPage> {
    const response = await leadersRepository.getLeadersPage(query);
    return { items: response.data, pagination: response.pagination };
  },

  async getLeaderById(id: string): Promise<Leader> {
    const response = await leadersRepository.getLeaderById(id);
    return response.data;
  },
};
