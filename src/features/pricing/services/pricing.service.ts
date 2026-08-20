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

/**
 * What every price display shows when it doesn't have a price.
 *
 * Pricing is fetched (it's admin-overridable, so today's number only exists
 * on the server), and every call site used to write `?? 0` for the failure
 * case -- rendering a confident "£0 + VAT/month" across Join, Renew and My
 * Subscription whenever that fetch failed. A wrong price is a real, visible
 * bug in a way a missing one isn't (ARCHITECTURE_HANDBOOK.md §3.5); say we
 * don't know instead of quoting free membership.
 */
export const PRICE_UNAVAILABLE_LABEL = "Price unavailable";

/** Formats a price that may be missing, never substituting a number for one we don't have. */
export function formatAmountOrUnavailable(amount: number | undefined, suffix = ""): string {
  return amount == null ? PRICE_UNAVAILABLE_LABEL : `${formatAmount(amount)}${suffix}`;
}

const CYCLE_SUFFIX: Record<"monthly" | "annual", string> = { monthly: "/month", annual: "/year" };

/** "£99 + VAT/month" -- the exact display format the client asked for. */
export function formatPriceLabel(amount: number, billingCycle: "monthly" | "annual"): string {
  return `${formatAmount(amount)} + VAT${CYCLE_SUFFIX[billingCycle]}`;
}
