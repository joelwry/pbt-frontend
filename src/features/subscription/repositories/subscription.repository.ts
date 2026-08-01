import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { Invoice } from "@/features/subscription/types";
import type { MembershipTier } from "@/features/session/types";
import { billingDetailsMock, type BillingDetails } from "@/features/subscription/mocks/subscription.mock";

export interface BackendSubscription {
  tier: "pathway" | "plus" | "mentorship";
  status: "active" | "pending" | "cancelled" | "expired";
  endDate: string;
  cancelled: boolean;
}

export const subscriptionRepository = {
  /** Payment method on file -- there's no real payment gateway yet (Stripe integration is deferred), so this stays a static placeholder. */
  async getBillingDetails(): Promise<ApiSuccess<BillingDetails>> {
    return billingDetailsMock;
  },

  async getCurrentSubscription(): Promise<ApiSuccess<BackendSubscription | null>> {
    const { data } = await apiClient.get<ApiSuccess<BackendSubscription | null>>("/subscriptions/current");
    return data;
  },

  async getInvoicesPage(page: number, limit: number): Promise<ApiPaginated<Invoice>> {
    const { data } = await apiClient.get<ApiPaginated<Invoice>>("/subscriptions/invoices", { params: { page, limit } });
    return data;
  },

  async cancelSubscription(): Promise<ApiSuccess<{ cancelled: boolean }>> {
    const { data } = await apiClient.post<ApiSuccess<{ cancelled: boolean }>>("/subscriptions/cancel", {});
    return data;
  },

  /** Upgrading, downgrading, or switching billing cycle all go through the same real Stripe Checkout flow as a renewal. */
  async createCheckoutSession(tier: MembershipTier, billingCycle: "monthly" | "annual"): Promise<ApiSuccess<{ checkoutUrl: string }>> {
    const { data } = await apiClient.post<ApiSuccess<{ checkoutUrl: string }>>("/billing/checkout-session", { tier, billingCycle });
    return data;
  },
};
