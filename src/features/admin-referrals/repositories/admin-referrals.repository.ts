import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminReferralStats, AdminReferral, ReferralFilterKey } from "@/features/admin-referrals/types";

export interface AdminReferralsQuery {
  search: string;
  filter?: ReferralFilterKey;
  page: number;
  limit: number;
}

export interface MarkPaidInput {
  paymentReference?: string;
  adminNote?: string;
}

export const adminReferralsRepository = {
  async getStats(): Promise<ApiSuccess<AdminReferralStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminReferralStats>>("/admin/referrals/stats");
    return data;
  },

  async getReferralsPage(query: AdminReferralsQuery): Promise<ApiPaginated<AdminReferral>> {
    const { data } = await adminApiClient.get<ApiPaginated<AdminReferral>>("/admin/referrals", {
      params: { search: query.search || undefined, filter: query.filter, page: query.page, limit: query.limit },
    });
    return data;
  },

  async markPaymentPending(referralId: string): Promise<ApiSuccess<AdminReferral>> {
    const { data } = await adminApiClient.patch<ApiSuccess<AdminReferral>>(`/admin/referrals/${referralId}/payment-pending`);
    return data;
  },

  async markPaid(referralId: string, input: MarkPaidInput): Promise<ApiSuccess<AdminReferral>> {
    const { data } = await adminApiClient.patch<ApiSuccess<AdminReferral>>(`/admin/referrals/${referralId}/mark-paid`, input);
    return data;
  },
};
