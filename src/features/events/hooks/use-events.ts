import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { eventsService } from "@/features/events/services/events.service";
import { useToast } from "@/providers/toast-provider";
import { getApiErrorMessage } from "@/lib/api-error";
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
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ eventId, details }: { eventId: string; details: RsvpDetails }) =>
      eventsService.submitRsvp(eventId, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      // Real gates now (membership tier, capacity) can genuinely reject an
      // RSVP, unlike the mock era where this call always succeeded.
      toast({ variant: "error", title: "Couldn't RSVP", description: getApiErrorMessage(error) });
    },
  });
}

export function useCancelRsvp() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (eventId: string) => eventsService.cancelRsvp(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      toast({ variant: "error", title: "Couldn't cancel RSVP", description: getApiErrorMessage(error) });
    },
  });
}
