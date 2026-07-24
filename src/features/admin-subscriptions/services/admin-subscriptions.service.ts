import { adminSubscriptionsRepository, type InvoicesQuery } from "@/features/admin-subscriptions/repositories/admin-subscriptions.repository";
import type { SubscriptionStats, RevenueByTier, Invoice } from "@/features/admin-subscriptions/types";
import type { Pagination } from "@/types/api";

export interface InvoicesPage {
  items: Invoice[];
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
};
