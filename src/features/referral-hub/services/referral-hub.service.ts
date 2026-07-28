import { referralHubRepository } from "@/features/referral-hub/repositories/referral-hub.repository";
import type { ReferralSummary, ReferredMember } from "@/features/referral-hub/types";
import type { Pagination } from "@/types/api";

export interface ReferredMembersPage {
  items: ReferredMember[];
  pagination: Pagination;
}

export const referralHubService = {
  async getSummary(): Promise<ReferralSummary> {
    const response = await referralHubRepository.getSummary();
    return response.data;
  },
  async getReferredMembersPage(page: number, limit: number): Promise<ReferredMembersPage> {
    const response = await referralHubRepository.getReferredMembers(page, limit);
    return { items: response.data, pagination: response.pagination };
  },
};
