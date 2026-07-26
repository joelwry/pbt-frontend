import { adminSubscriptionsRepository, type InvoicesQuery } from "@/features/admin-subscriptions/repositories/admin-subscriptions.repository";
import type { SubscriptionStats, RevenueByTier, Invoice, MentorshipMember } from "@/features/admin-subscriptions/types";
import type { Pagination } from "@/types/api";

export interface InvoicesPage {
  items: Invoice[];
  pagination: Pagination;
}

export interface MentorshipMembersPage {
  items: MentorshipMember[];
  pagination: Pagination;
}

export const adminSubscriptionsService = {
  async getStats(): Promise<SubscriptionStats> {
    const response = await adminSubscriptionsRepository.getStats();
    return response.data;
  },
  async getRevenueByTier(): Promise<RevenueByTier> {
    const response = await adminSubscriptionsRepository.getRevenueByTier();
    return response.data;
  },
  async getInvoicesPage(query: InvoicesQuery): Promise<InvoicesPage> {
    const response = await adminSubscriptionsRepository.getInvoicesPage(query);
    return { items: response.data, pagination: response.pagination };
  },
  async getMentorshipMembersPage(page: number, limit: number): Promise<MentorshipMembersPage> {
    const response = await adminSubscriptionsRepository.getMentorshipMembers(page, limit);
    return { items: response.data, pagination: response.pagination };
  },
  async assignMentor(userId: string, leaderId: string | null): Promise<void> {
    await adminSubscriptionsRepository.assignMentor(userId, leaderId);
  },
};
