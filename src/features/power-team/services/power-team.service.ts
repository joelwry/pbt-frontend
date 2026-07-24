import { powerTeamRepository, type PartnersQuery } from "@/features/power-team/repositories/power-team.repository";
import type { Partner } from "@/features/power-team/types";
import type { Pagination } from "@/types/api";

export interface PartnersPage {
  items: Partner[];
  pagination: Pagination;
}

export const powerTeamService = {
  async getPartnersPage(query: PartnersQuery): Promise<PartnersPage> {
    const response = await powerTeamRepository.getPartnersPage(query);
    return { items: response.data, pagination: response.pagination };
  },
};
