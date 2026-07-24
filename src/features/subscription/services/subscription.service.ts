import { subscriptionRepository } from "@/features/subscription/repositories/subscription.repository";
import { MEMBERSHIP_TIERS } from "@/features/membership/tiers";
import type { CurrentMember } from "@/features/session/types";
import type { SubscriptionSummary, Invoice } from "@/features/subscription/types";
import type { Pagination } from "@/types/api";

export interface InvoicesPage {
  items: Invoice[];
  pagination: Pagination;
}

export const subscriptionService = {
  /** Composes the subscription summary from the real logged-in member (tier, client ID, dates) + billing extras from the repository. */
  async getSubscription(member: CurrentMember, cancelled: boolean): Promise<SubscriptionSummary> {
    const billing = await subscriptionRepository.getBillingDetails();
    const tierDef = MEMBERSHIP_TIERS[member.membershipTier];

    return {
      tier: member.membershipTier,
      cancelled,
      contractLabel: tierDef.contractLabel,
      clientId: member.clientId,
      nextBillingLabel: new Date(member.subscriptionDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      amountLabel: tierDef.priceLabel.split("/")[0],
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
};
