import { pricingRepository } from "@/features/pricing/repositories/pricing.repository";
import type { PricingByTier } from "@/features/pricing/types";

export const pricingService = {
  async getPricingByTier(): Promise<PricingByTier> {
    const { data } = await pricingRepository.getPricing();
    const byTier = {} as PricingByTier;
    for (const row of data) {
      byTier[row.tier] = { ...byTier[row.tier], [row.billingCycle]: row.amount };
    }
    return byTier;
  },
};

/** "£99" (no cycle suffix -- callers append their own "/month" or "+VAT" copy as needed). */
export function formatAmount(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

const CYCLE_SUFFIX: Record<"monthly" | "annual", string> = { monthly: "/month", annual: "/year" };

/** "£99 + VAT/month" -- the exact display format the client asked for. */
export function formatPriceLabel(amount: number, billingCycle: "monthly" | "annual"): string {
  return `${formatAmount(amount)} + VAT${CYCLE_SUFFIX[billingCycle]}`;
}
