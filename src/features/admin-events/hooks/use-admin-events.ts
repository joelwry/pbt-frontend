import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminEventsService } from "@/features/admin-events/services/admin-events.service";
import type { AdminEvent, EventFilterTab } from "@/features/admin-events/types";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function useAdminEventsStats() {
  return useQuery({
    queryKey: ["admin", "events", "stats"],
    queryFn: adminEventsService.getStats,
  });
}

export function useAdminEventsPage(tab: EventFilterTab, search: string, page: number) {
  return useQuery({
    queryKey: ["admin", "events", "list", tab, search, page],
    queryFn: () => adminEventsService.getEventsPage({ tab, search, page, limit: 5, todayIso: todayIso() }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminEvent(id: string) {
  return useQuery({
    queryKey: ["admin", "events", "detail", id],
    queryFn: () => adminEventsService.getEventById(id),
    enabled: Boolean(id) && id !== "new",
  });
}

function useInvalidateEvents() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["admin", "events"] });
}

export function useSaveEvent() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (input: AdminEvent) => adminEventsService.saveEvent(input),
    onSuccess: invalidate,
  });
}

export function useCancelEvent() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: string) => adminEventsService.cancelEvent(id),
    onSuccess: invalidate,
  });
}

export function useDeleteEvent() {
  const invalidate = useInvalidateEvents();
  return useMutation({
    mutationFn: (id: string) => adminEventsService.deleteEvent(id),
    onSuccess: invalidate,
  });
}
