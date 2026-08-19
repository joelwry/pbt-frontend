import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/api-error";
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
  const { toast } = useToast();
  return useMutation({
    mutationFn: subscriptionService.cancelSubscription,
    onSuccess: () => {
      onCancelled();
      queryClient.invalidateQueries({ queryKey: ["subscription", "summary"] });
    },
    onError: (error) => {
      // Cancelling can genuinely fail now that it has to stop the real
      // Stripe subscription before it reports success -- the backend
      // deliberately refuses rather than showing a member a cancelled
      // membership that is still being charged. Without this the dialog
      // just stopped spinning and sat there, telling the member nothing.
      toast({ variant: "error", title: "Couldn't cancel your membership", description: getApiErrorMessage(error) });
    },
  });
}

export function useChangeTierCheckout() {
  return useMutation({
    mutationFn: ({ tier, billingCycle }: { tier: MembershipTier; billingCycle: "monthly" | "annual" }) =>
      subscriptionService.createCheckoutSession(tier, billingCycle),
  });
}

/** Fetches the branded receipt PDF and hands it to the browser as a real file download. */
export function useDownloadReceipt() {
  return useMutation({
    mutationFn: async ({ invoiceId, filename }: { invoiceId: string; filename: string }) => {
      const blob = await subscriptionService.downloadReceipt(invoiceId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
  });
}
