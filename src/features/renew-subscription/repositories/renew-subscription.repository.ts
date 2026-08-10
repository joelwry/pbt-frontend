import { apiClient } from "@/lib/api-client";
import type { ApiSuccess } from "@/types/api";
import type { MembershipTier } from "@/features/session/types";
import type { RenewalCheckoutSession } from "@/features/renew-subscription/types";

export const renewSubscriptionRepository = {
  /**
   * Real flow: Express creates a Stripe Checkout Session server-side and
   * returns its hosted URL; the frontend redirects there
   * (window.location.href). Stripe redirects back to a success URL after
   * payment, but the actual subscription activation happens via a Stripe
   * webhook hitting the backend, never anything the frontend calls
   * directly.
   */
  async createCheckoutSession(tier: MembershipTier): Promise<ApiSuccess<RenewalCheckoutSession>> {
    const { data } = await apiClient.post<ApiSuccess<RenewalCheckoutSession>>("/billing/checkout-session", {
      tier,
      billingCycle: "monthly",
    });
    return data;
  },
};
