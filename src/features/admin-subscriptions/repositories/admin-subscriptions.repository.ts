import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { SubscriptionStats, RevenueByTier, Invoice, InvoiceStatus } from "@/features/admin-subscriptions/types";
import { subscriptionStatsMock, revenueByTierMock, invoicesMock } from "@/features/admin-subscriptions/mocks/admin-subscriptions.mock";

const SIMULATED_LATENCY_MS = 500;
const invoicesStore: Invoice[] = [...invoicesMock];

export interface InvoicesQuery {
  status: InvoiceStatus | "All";
  search: string;
  page: number;
  limit: number;
}

export const adminSubscriptionsRepository = {
  async getStats(): Promise<ApiSuccess<SubscriptionStats>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return subscriptionStatsMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<SubscriptionStats>>("/admin/subscriptions/stats");
    // return data;
  },

  async getRevenueByTier(): Promise<ApiSuccess<RevenueByTier>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return revenueByTierMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<RevenueByTier>>("/admin/subscriptions/revenue-by-tier");
    // return data;
  },

  async getInvoicesPage(query: InvoicesQuery): Promise<ApiPaginated<Invoice>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    const filtered = invoicesStore.filter((invoice) => {
      const matchesStatus = query.status === "All" || invoice.status === query.status;
      const matchesSearch =
        !q || invoice.memberName.toLowerCase().includes(q) || invoice.invoiceNumber.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });

    const start = (query.page - 1) * query.limit;
    const items = filtered.slice(start, start + query.limit);
    const totalPages = Math.max(1, Math.ceil(filtered.length / query.limit));

    return {
      success: true,
      data: items,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalItems: filtered.length,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiPaginated<Invoice>>("/admin/subscriptions/invoices", { params: query });
    // return data;
  },
};
