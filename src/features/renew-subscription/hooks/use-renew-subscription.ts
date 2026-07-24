import { useMutation } from "@tanstack/react-query";
import { renewSubscriptionService } from "@/features/renew-subscription/services/renew-subscription.service";
import type { MembershipTier } from "@/features/session/types";

export function useRenewSubscription() {
  return useMutation({
    mutationFn: (tier: MembershipTier) => renewSubscriptionService.renew(tier),
  });
}
