import { subscriptionRepository } from "@/features/subscription/repositories/subscription.repository";
import { MEMBERSHIP_TIERS } from "@/features/membership/tiers";
import type { CurrentMember, MembershipTier } from "@/features/session/types";
import type { SubscriptionSummary, Invoice } from "@/features/subscription/types";
import type { Pagination } from "@/types/api";

export interface InvoicesPage {
  items: Invoice[];
  pagination: Pagination;
}

export const subscriptionService = {
  /** Composes the subscription summary from the real logged-in member (tier, client ID) + the real current subscription (cancelled flag, renewal/lapse date) + billing extras from the repository. */
  async getSubscription(member: CurrentMember): Promise<SubscriptionSummary> {
    const [billing, subscription] = await Promise.all([
      subscriptionRepository.getBillingDetails(),
      subscriptionRepository.getCurrentSubscription(),
    ]);
    const tierDef = MEMBERSHIP_TIERS[member.membershipTier];
    const nextBillingDate = subscription.data?.endDate ?? member.subscriptionDate;

    return {
      tier: member.membershipTier,
      cancelled: subscription.data?.cancelled ?? false,
      contractLabel: tierDef.contractLabel,
      clientId: member.clientId,
      nextBillingLabel: new Date(nextBillingDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      amountLabel: subscription.data
        ? `£${subscription.data.amount.toLocaleString("en-GB")} + VAT/${subscription.data.billingCycle === "monthly" ? "month" : "year"}`
        : "—",
      paymentMethodLabel: billing.data.paymentMethodLabel,
    };
  },

  async getInvoicesPage(page: number, limit: number): Promise<InvoicesPage> {
    const response = await subscriptionRepository.getInvoicesPage(page, limit);
    return { items: response.data, pagination: response.pagination };
  },

  async cancelSubscription(): Promise<boolean> {
    const response = await subscriptionRepository.cancelSubscription();
    return response.data.cancelled;
  },

  async createCheckoutSession(tier: MembershipTier, billingCycle: "monthly" | "annual"): Promise<string> {
    const response = await subscriptionRepository.createCheckoutSession(tier, billingCycle);
    return response.data.checkoutUrl;
  },

  async downloadReceipt(invoiceId: string): Promise<Blob> {
    return subscriptionRepository.downloadReceipt(invoiceId);
  },
};
