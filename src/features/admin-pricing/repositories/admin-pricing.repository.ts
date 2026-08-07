import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess } from "@/types/api";
import type { AdminTierPricing, AdminBillingTier, AdminBillingCycle } from "@/features/admin-pricing/types";

export const adminPricingRepository = {
  async getPricing(): Promise<ApiSuccess<AdminTierPricing[]>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminTierPricing[]>>("/admin/pricing");
    return data;
  },

  async setPricing(tier: AdminBillingTier, billingCycle: AdminBillingCycle, amount: number): Promise<ApiSuccess<AdminTierPricing>> {
    const { data } = await adminApiClient.put<ApiSuccess<AdminTierPricing>>(`/admin/pricing/${tier}/${billingCycle}`, { amount });
    return data;
  },

  async resetPricing(tier: AdminBillingTier, billingCycle: AdminBillingCycle): Promise<ApiSuccess<AdminTierPricing>> {
    const { data } = await adminApiClient.post<ApiSuccess<AdminTierPricing>>(`/admin/pricing/${tier}/${billingCycle}/reset`, {});
    return data;
  },
};
