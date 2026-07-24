import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminLeadersService } from "@/features/admin-leaders/services/admin-leaders.service";
import type { AdminLeader, AdminLeaderRegion } from "@/features/admin-leaders/types";

export function useAdminLeadersStats() {
  return useQuery({ queryKey: ["admin", "leaders", "stats"], queryFn: adminLeadersService.getStats });
}

export function useAdminLeadersPage(region: AdminLeaderRegion | "All", search: string, page: number) {
  return useQuery({
    queryKey: ["admin", "leaders", "list", region, search, page],
    queryFn: () => adminLeadersService.getLeadersPage({ region, search, page, limit: 4 }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminLeader(id: string) {
  return useQuery({
    queryKey: ["admin", "leaders", "detail", id],
    queryFn: () => adminLeadersService.getLeaderById(id),
    enabled: Boolean(id) && id !== "new",
  });
}

function useInvalidateLeaders() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["admin", "leaders"] });
}

export function useSaveLeader() {
  const invalidate = useInvalidateLeaders();
  return useMutation({ mutationFn: (input: AdminLeader) => adminLeadersService.saveLeader(input), onSuccess: invalidate });
}

export function useDeleteLeader() {
  const invalidate = useInvalidateLeaders();
  return useMutation({ mutationFn: (id: string) => adminLeadersService.deleteLeader(id), onSuccess: invalidate });
}
