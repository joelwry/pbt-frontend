import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { eventsService } from "@/features/events/services/events.service";
import type { EventsTab, RsvpDetails } from "@/features/events/types";

const EVENTS_PAGE_SIZE = 4;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function useEventsPage(tab: EventsTab, page: number) {
  return useQuery({
    queryKey: ["events", tab, page],
    queryFn: () => eventsService.getEventsPage(tab, todayIso(), page, EVENTS_PAGE_SIZE),
    placeholderData: keepPreviousData,
  });
}

export function useSubmitRsvp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, details }: { eventId: string; details: RsvpDetails }) =>
      eventsService.submitRsvp(eventId, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useCancelRsvp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => eventsService.cancelRsvp(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
