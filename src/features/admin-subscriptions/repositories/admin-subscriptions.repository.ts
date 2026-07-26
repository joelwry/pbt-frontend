import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { SubscriptionStats, RevenueByTier, Invoice, InvoiceStatus, MentorshipMember } from "@/features/admin-subscriptions/types";

export interface InvoicesQuery {
  status: InvoiceStatus | "All";
  search: string;
  page: number;
  limit: number;
}

export const adminSubscriptionsRepository = {
  async getStats(): Promise<ApiSuccess<SubscriptionStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<SubscriptionStats>>("/admin/subscriptions/stats");
    return data;
  },

  async getRevenueByTier(): Promise<ApiSuccess<RevenueByTier>> {
    const { data } = await adminApiClient.get<ApiSuccess<RevenueByTier>>("/admin/subscriptions/revenue-by-tier");
    return data;
  },

  async getInvoicesPage(query: InvoicesQuery): Promise<ApiPaginated<Invoice>> {
    const { data } = await adminApiClient.get<ApiPaginated<Invoice>>("/admin/subscriptions/invoices", {
      params: { status: query.status, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return data;
  },

  async getMentorshipMembers(page: number, limit: number): Promise<ApiPaginated<MentorshipMember>> {
    const { data } = await adminApiClient.get<ApiPaginated<MentorshipMember>>("/admin/subscriptions/mentorship-members", {
      params: { page, limit },
    });
    return data;
  },

  async assignMentor(userId: string, leaderId: string | null): Promise<ApiSuccess<{ userId: string; assignedLeader: string | null }>> {
    const { data } = await adminApiClient.patch<ApiSuccess<{ userId: string; assignedLeader: string | null }>>(
      `/admin/subscriptions/members/${userId}/assign-mentor`,
      { leaderId }
    );
    return data;
  },
};
