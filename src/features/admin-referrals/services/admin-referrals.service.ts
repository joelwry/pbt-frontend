import { adminReferralsRepository, type AdminReferralsQuery } from "@/features/admin-referrals/repositories/admin-referrals.repository";
import type { AdminReferralStats, AdminReferral } from "@/features/admin-referrals/types";
import type { Pagination } from "@/types/api";

export interface AdminReferralsPage {
  items: AdminReferral[];
  pagination: Pagination;
}

export const adminReferralsService = {
  async getStats(): Promise<AdminReferralStats> {
    const response = await adminReferralsRepository.getStats();
    return response.data;
  },
  async getReferralsPage(query: AdminReferralsQuery): Promise<AdminReferralsPage> {
    const response = await adminReferralsRepository.getReferralsPage(query);
    return { items: response.data, pagination: response.pagination };
  },
};
