import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { Invoice } from "@/features/subscription/types";
import { billingDetailsMock, invoicesMock, type BillingDetails } from "@/features/subscription/mocks/subscription.mock";

const SIMULATED_LATENCY_MS = 400;
const invoicesStore: Invoice[] = [...invoicesMock];
let cancelledFlag = false;

export const subscriptionRepository = {
  /** Payment method / billing extras not already carried on the member record. */
  async getBillingDetails(): Promise<ApiSuccess<BillingDetails>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return billingDetailsMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<BillingDetails>>("/members/me/billing-details");
    // return data;
  },

  async getInvoicesPage(page: number, limit: number): Promise<ApiPaginated<Invoice>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const start = (page - 1) * limit;
    const items = invoicesStore.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(invoicesStore.length / limit));

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        totalItems: invoicesStore.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiPaginated<Invoice>>("/members/me/invoices", { params: { page, limit } });
    // return data;
  },

  async cancelSubscription(): Promise<ApiSuccess<{ cancelled: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    cancelledFlag = true;
    return { success: true, message: "Subscription cancelled successfully", data: { cancelled: cancelledFlag } };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.post<ApiSuccess<{ cancelled: boolean }>>("/members/me/subscription/cancel");
    // return data;
  },
};
