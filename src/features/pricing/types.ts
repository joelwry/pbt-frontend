import type { MembershipTier } from "@/features/session/types";

export type BillingCycle = "monthly" | "annual";

export interface PricingRow {
  tier: MembershipTier;
  tierLabel: string;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
}

export type PricingByTier = Record<MembershipTier, Record<BillingCycle, number>>;
