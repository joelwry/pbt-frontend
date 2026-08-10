import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminReferralsService } from "@/features/admin-referrals/services/admin-referrals.service";
import type { MarkPaidInput } from "@/features/admin-referrals/repositories/admin-referrals.repository";
import type { ReferralFilterKey } from "@/features/admin-referrals/types";

export function useAdminReferralStats() {
  return useQuery({ queryKey: ["admin", "referrals", "stats"], queryFn: adminReferralsService.getStats });
}

export function useAdminReferralsPage(search: string, filter: ReferralFilterKey | undefined, page: number) {
  return useQuery({
    queryKey: ["admin", "referrals", "list", search, filter, page],
    queryFn: () => adminReferralsService.getReferralsPage({ search, filter, page, limit: 8 }),
    placeholderData: keepPreviousData,
  });
}

function useInvalidateReferrals() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["admin", "referrals"] });
}

export function useMarkPaymentPending() {
  const invalidate = useInvalidateReferrals();
  return useMutation({
    mutationFn: (referralId: string) => adminReferralsService.markPaymentPending(referralId),
    onSuccess: () => invalidate(),
  });
}

export function useMarkReferralPaid() {
  const invalidate = useInvalidateReferrals();
  return useMutation({
    mutationFn: ({ referralId, input }: { referralId: string; input: MarkPaidInput }) =>
      adminReferralsService.markPaid(referralId, input),
    onSuccess: () => invalidate(),
  });
}
