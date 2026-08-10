import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSiteSettingsRepository } from "@/features/admin-site-settings/repositories/admin-site-settings.repository";
import type { SiteSettings } from "@/features/site-settings/types";

const QUERY_KEY = ["admin", "site-settings"];

export function useAdminSiteSettings() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => (await adminSiteSettingsRepository.getSettings()).data,
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<SiteSettings>) => adminSiteSettingsRepository.updateSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      // The member-facing hook reads the same underlying setting.
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });
}
