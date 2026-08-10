import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { referralHubService } from "@/features/referral-hub/services/referral-hub.service";

export function useReferralSummary() {
  return useQuery({ queryKey: ["referral-hub", "summary"], queryFn: referralHubService.getSummary });
}

export function useReferredMembers(page: number) {
  return useQuery({
    queryKey: ["referral-hub", "referred", page],
    queryFn: () => referralHubService.getReferredMembersPage(page, 5),
    placeholderData: keepPreviousData,
  });
}
