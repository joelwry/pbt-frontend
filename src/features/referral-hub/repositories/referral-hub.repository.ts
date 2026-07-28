import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { ReferralSummary, ReferredMember } from "@/features/referral-hub/types";

export const referralHubRepository = {
  async getSummary(): Promise<ApiSuccess<ReferralSummary>> {
    const { data } = await apiClient.get<ApiSuccess<ReferralSummary>>("/referrals/me");
    return data;
  },

  async getReferredMembers(page: number, limit: number): Promise<ApiPaginated<ReferredMember>> {
    const { data } = await apiClient.get<ApiPaginated<ReferredMember>>("/referrals/me/referred", { params: { page, limit } });
    return data;
  },
};
