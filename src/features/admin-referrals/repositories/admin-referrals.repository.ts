import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminReferralStats, AdminReferral } from "@/features/admin-referrals/types";

export interface AdminReferralsQuery {
  search: string;
  page: number;
  limit: number;
}

export const adminReferralsRepository = {
  async getStats(): Promise<ApiSuccess<AdminReferralStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminReferralStats>>("/admin/referrals/stats");
    return data;
  },

  async getReferralsPage(query: AdminReferralsQuery): Promise<ApiPaginated<AdminReferral>> {
    const { data } = await adminApiClient.get<ApiPaginated<AdminReferral>>("/admin/referrals", {
      params: { search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return data;
  },
};
