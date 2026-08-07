import { useQuery } from "@tanstack/react-query";
import { siteSettingsRepository } from "@/features/site-settings/repositories/site-settings.repository";

const DEFAULT_WORKSHOP_LABEL = "Deal Clinic";

export function useSiteSettings() {
  const query = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => (await siteSettingsRepository.getSettings()).data,
    staleTime: 60_000,
  });

  return {
    ...query,
    /** Always safe to use directly in JSX -- falls back to the current default while loading or if the request fails. */
    workshopLabel: query.data?.workshopLabel ?? DEFAULT_WORKSHOP_LABEL,
  };
}
