import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { adminReferralsService } from "@/features/admin-referrals/services/admin-referrals.service";

export function useAdminReferralStats() {
  return useQuery({ queryKey: ["admin", "referrals", "stats"], queryFn: adminReferralsService.getStats });
}

export function useAdminReferralsPage(search: string, page: number) {
  return useQuery({
    queryKey: ["admin", "referrals", "list", search, page],
    queryFn: () => adminReferralsService.getReferralsPage({ search, page, limit: 8 }),
    placeholderData: keepPreviousData,
  });
}
