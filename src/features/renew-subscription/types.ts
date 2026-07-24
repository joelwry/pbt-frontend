import type { MembershipTier } from "@/features/session/types";

export interface RenewalCheckoutSession {
  checkoutSessionId: string;
  /** In production this is the real Stripe-hosted checkout URL to redirect to. */
  checkoutUrl: string;
}

export interface RenewalConfirmation {
  tier: MembershipTier;
  subscriptionStatus: "active";
  nextBillingDate: string;
}
