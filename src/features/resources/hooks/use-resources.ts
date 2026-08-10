import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import { resourcesService } from "@/features/resources/services/resources.service";
import type { ResourceCategory } from "@/features/resources/types";

const RESOURCES_PAGE_SIZE = 8;

export function useFeaturedToolkit() {
  return useQuery({
    queryKey: ["resources", "featured"],
    queryFn: resourcesService.getFeaturedToolkit,
  });
}

export function useResourcesPage(category: ResourceCategory | "All", search: string, page: number) {
  return useQuery({
    queryKey: ["resources", "list", category, search, page],
    queryFn: () => resourcesService.getResourcesPage({ category, search, page, limit: RESOURCES_PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });
}

/** Fire-and-forget — a failed tracking call should never block or roll back the download itself. */
export function useTrackDownload() {
  return useMutation({
    mutationFn: (resourceId: string) => resourcesService.trackDownload(resourceId),
  });
}
