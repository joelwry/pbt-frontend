import { useQuery } from "@tanstack/react-query";
import { pricingService } from "@/features/pricing/services/pricing.service";

export function usePricing() {
  return useQuery({
    queryKey: ["pricing"],
    queryFn: pricingService.getPricingByTier,
    staleTime: 60_000,
  });
}
