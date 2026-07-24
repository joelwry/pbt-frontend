import { adminPowerTeamRepository, type AdminPartnersQuery } from "@/features/admin-power-team/repositories/admin-power-team.repository";
import type { AdminPartner, AdminPowerTeamStats } from "@/features/admin-power-team/types";
import type { Pagination } from "@/types/api";

export interface AdminPartnersPage {
  items: AdminPartner[];
  pagination: Pagination;
}

export const adminPowerTeamService = {
  async getStats(): Promise<AdminPowerTeamStats> {
    const response = await adminPowerTeamRepository.getStats();
    return response.data;
  },
  async getPartnersPage(query: AdminPartnersQuery): Promise<AdminPartnersPage> {
    const response = await adminPowerTeamRepository.getPartnersPage(query);
    return { items: response.data, pagination: response.pagination };
  },
  async getPartnerById(id: string): Promise<AdminPartner> {
    const response = await adminPowerTeamRepository.getPartnerById(id);
    return response.data;
  },
  async savePartner(input: AdminPartner): Promise<AdminPartner> {
    const response = await adminPowerTeamRepository.savePartner(input);
    return response.data;
  },
  async deletePartner(id: string): Promise<boolean> {
    const response = await adminPowerTeamRepository.deletePartner(id);
    return response.data.deleted;
  },
};
