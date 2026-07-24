import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { mentorshipService } from "@/features/mentorship/services/mentorship.service";

const CALLS_PAGE_SIZE = 3;

export function useMentorshipPage() {
  return useQuery({
    queryKey: ["mentorship", "page"],
    queryFn: mentorshipService.getMentorshipPage,
    staleTime: 10 * 60 * 1000,
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
    mutationFn: (input: { topic: string; dateLabel: string; mentorName: string }) => mentorshipService.bookCall(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentorship", "calls"] });
    },
  });
}
