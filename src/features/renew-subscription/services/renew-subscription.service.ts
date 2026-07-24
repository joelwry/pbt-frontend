import { renewSubscriptionRepository } from "@/features/renew-subscription/repositories/renew-subscription.repository";
import type { MembershipTier } from "@/features/session/types";
import type { RenewalConfirmation } from "@/features/renew-subscription/types";

export const renewSubscriptionService = {
  async renew(tier: MembershipTier): Promise<RenewalConfirmation> {
    // Step 1: would redirect to Stripe Checkout here in production.
    await renewSubscriptionRepository.createCheckoutSession(tier);
    // Step 2: stands in for Stripe's redirect back + webhook confirmation.
    const response = await renewSubscriptionRepository.simulateSuccessfulPayment(tier);
    return response.data;
  },
};
