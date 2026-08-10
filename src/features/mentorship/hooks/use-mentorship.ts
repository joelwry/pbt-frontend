import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { mentorshipService } from "@/features/mentorship/services/mentorship.service";

const CALLS_PAGE_SIZE = 3;

/** enabled: false when the member's tier can't access this page -- avoids firing a request the backend will 403 (it enforces the same tier gate server-side), so the client-side gate is what renders instead of a generic error. */
export function useMentorshipPage(enabled: boolean = true) {
  return useQuery({
    queryKey: ["mentorship", "page"],
    queryFn: mentorshipService.getMentorshipPage,
    staleTime: 10 * 60 * 1000,
    enabled,
  });
}

export function useMentorshipCalls(page: number) {
  return useQuery({
    queryKey: ["mentorship", "calls", page],
    queryFn: () => mentorshipService.getCallsPage(page, CALLS_PAGE_SIZE),
    placeholderData: keepPreviousData,
  });
}

export function useBookCall() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { topic: string; scheduledAt: string }) => mentorshipService.bookCall(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorship", "calls"] });
    },
  });
}
