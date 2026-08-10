import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { subscriptionService } from "@/features/subscription/services/subscription.service";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import type { MembershipTier } from "@/features/session/types";

export function useSubscription() {
  const { data: member, isLoading: memberLoading } = useCurrentMember();

  const query = useQuery({
    queryKey: ["subscription", "summary", member?.id],
    queryFn: () => subscriptionService.getSubscription(member!),
    enabled: Boolean(member),
  });

  return { ...query, isLoading: memberLoading || query.isLoading };
}

export function useInvoicesPage(page: number) {
  return useQuery({
    queryKey: ["subscription", "invoices", page],
    queryFn: () => subscriptionService.getInvoicesPage(page, 4),
    placeholderData: keepPreviousData,
  });
}

export function useCancelSubscription(onCancelled: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: () => {
      onCancelled();
      queryClient.invalidateQueries({ queryKey: ["subscription", "summary"] });
    },
  });
}

export function useChangeTierCheckout() {
  return useMutation({
    mutationFn: ({ tier, billingCycle }: { tier: MembershipTier; billingCycle: "monthly" | "annual" }) =>
      subscriptionService.createCheckoutSession(tier, billingCycle),
  });
}
