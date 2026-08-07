import { apiClient } from "@/lib/api-client";
import type { ApiSuccess } from "@/types/api";
import type { PricingRow } from "@/features/pricing/types";

export const pricingRepository = {
  /** Public endpoint -- no auth required, powers pricing display on /join and /login before a session exists. */
  async getPricing(): Promise<ApiSuccess<PricingRow[]>> {
    const { data } = await apiClient.get<ApiSuccess<PricingRow[]>>("/pricing");
    return data;
  },
};
