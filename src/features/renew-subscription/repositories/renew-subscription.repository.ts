import type { ApiSuccess } from "@/types/api";
import type { MembershipTier } from "@/features/session/types";
import type { RenewalCheckoutSession, RenewalConfirmation } from "@/features/renew-subscription/types";

/**
 * Real payment processing happens with Stripe, never in this codebase. The
 * production flow is:
 *   1. POST /billing/checkout-session { tier } -> Express creates a Stripe
 *      Checkout Session server-side and returns its hosted URL.
 *   2. Frontend does `window.location.href = checkoutUrl` (or
 *      `stripe.redirectToCheckout({ sessionId })`) to hand off to Stripe.
 *   3. Stripe redirects back to a success URL after payment; the actual
 *      subscription activation happens via a Stripe webhook hitting the
 *      backend, NOT anything the frontend calls directly.
 *   4. The frontend re-fetches the member/session to reflect the new status.
 *
 * Everything below simulates that round trip locally so the UI/UX can be
 * built and tested without a Stripe account or backend.
 */
const SIMULATED_LATENCY_MS = 900;

export const renewSubscriptionRepository = {
  async createCheckoutSession(tier: MembershipTier): Promise<ApiSuccess<RenewalCheckoutSession>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return {
      success: true,
      message: "Checkout session created",
      data: {
        checkoutSessionId: `cs_mock_${Date.now()}`,
        checkoutUrl: `https://checkout.stripe.com/c/pay/mock_${tier.toLowerCase()}`,
      },
    };

    // Live implementation, once the Express API + Stripe exist:
    // const { data } = await apiClient.post<ApiSuccess<RenewalCheckoutSession>>("/billing/checkout-session", { tier });
    // return data;
  },

  /** Stands in for the redirect-to-Stripe-and-back round trip + webhook confirmation. */
  async simulateSuccessfulPayment(tier: MembershipTier): Promise<ApiSuccess<RenewalConfirmation>> {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    return {
      success: true,
      message: "Payment confirmed, subscription renewed",
      data: {
        tier,
        subscriptionStatus: "active",
        nextBillingDate: nextBillingDate.toISOString().slice(0, 10),
      },
    };
  },
};
