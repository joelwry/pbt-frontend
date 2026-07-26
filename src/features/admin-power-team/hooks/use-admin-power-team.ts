import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminPowerTeamService } from "@/features/admin-power-team/services/admin-power-team.service";
import type { AdminPartner, AdminPartnerCategory } from "@/features/admin-power-team/types";

export function useAdminPowerTeamStats() {
  return useQuery({ queryKey: ["admin", "power-team", "stats"], queryFn: adminPowerTeamService.getStats });
}

export function useAdminPartnersPage(category: AdminPartnerCategory | "All", search: string, page: number) {
  return useQuery({
    queryKey: ["admin", "power-team", "list", category, search, page],
    queryFn: () => adminPowerTeamService.getPartnersPage({ category, search, page, limit: 4 }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminPartner(id: string) {
  return useQuery({
    queryKey: ["admin", "power-team", "detail", id],
    queryFn: () => adminPowerTeamService.getPartnerById(id),
    enabled: Boolean(id) && id !== "new",
  });
}

function useInvalidatePartners() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["admin", "power-team"] });
}

export function useSavePartner() {
  const invalidate = useInvalidatePartners();
  return useMutation({ mutationFn: (input: AdminPartner) => adminPowerTeamService.savePartner(input), onSuccess: invalidate });
}

export function useDeletePartner() {
  const invalidate = useInvalidatePartners();
  return useMutation({ mutationFn: (id: string) => adminPowerTeamService.deletePartner(id), onSuccess: invalidate });
}

export function useUploadPartnerLogo() {
  return useMutation({
    mutationFn: ({ partnerId, file }: { partnerId: string; file: File }) => adminPowerTeamService.uploadLogo(partnerId, file),
  });
}
