export type AdminBillingTier = "pathway" | "plus" | "mentorship";
export type AdminBillingCycle = "monthly" | "annual";

export interface AdminTierPricing {
  tier: AdminBillingTier;
  tierLabel: string;
  billingCycle: AdminBillingCycle;
  amount: number;
  currency: string;
  stripePriceId: string;
  isDefault: boolean;
}
