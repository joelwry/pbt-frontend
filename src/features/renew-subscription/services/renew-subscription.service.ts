import { renewSubscriptionRepository } from "@/features/renew-subscription/repositories/renew-subscription.repository";
import type { MembershipTier } from "@/features/session/types";
import type { RenewalCheckoutSession } from "@/features/renew-subscription/types";

export const renewSubscriptionService = {
  async renew(tier: MembershipTier): Promise<RenewalCheckoutSession> {
    const response = await renewSubscriptionRepository.createCheckoutSession(tier);
    return response.data;
  },
};
