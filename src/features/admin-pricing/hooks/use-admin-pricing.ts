import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminPricingRepository } from "@/features/admin-pricing/repositories/admin-pricing.repository";
import type { AdminBillingTier, AdminBillingCycle } from "@/features/admin-pricing/types";

const QUERY_KEY = ["admin", "pricing"];

export function useAdminPricing() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => (await adminPricingRepository.getPricing()).data,
  });
}

export function useSetPricing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tier, billingCycle, amount }: { tier: AdminBillingTier; billingCycle: AdminBillingCycle; amount: number }) =>
      adminPricingRepository.setPricing(tier, billingCycle, amount),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useResetPricing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tier, billingCycle }: { tier: AdminBillingTier; billingCycle: AdminBillingCycle }) =>
      adminPricingRepository.resetPricing(tier, billingCycle),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
