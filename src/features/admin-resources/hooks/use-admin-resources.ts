import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminResourcesService } from "@/features/admin-resources/services/admin-resources.service";
import type { AdminResource, AdminResourceCategory } from "@/features/admin-resources/types";

export function useAdminResourcesStats() {
  return useQuery({
    queryKey: ["admin", "resources", "stats"],
    queryFn: adminResourcesService.getStats,
  });
}

export function useAdminResourcesPage(category: AdminResourceCategory | "All", search: string, page: number) {
  return useQuery({
    queryKey: ["admin", "resources", "list", category, search, page],
    queryFn: () => adminResourcesService.getResourcesPage({ category, search, page, limit: 6 }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminResource(id: string) {
  return useQuery({
    queryKey: ["admin", "resources", "detail", id],
    queryFn: () => adminResourcesService.getResourceById(id),
    enabled: Boolean(id) && id !== "new",
  });
}

function useInvalidateResources() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["admin", "resources"] });
}

export function useSaveResource() {
  const invalidate = useInvalidateResources();
  return useMutation({
    mutationFn: (input: AdminResource) => adminResourcesService.saveResource(input),
    onSuccess: invalidate,
  });
}

export function useDeleteResource() {
  const invalidate = useInvalidateResources();
  return useMutation({
    mutationFn: (id: string) => adminResourcesService.deleteResource(id),
    onSuccess: invalidate,
  });
}

export function useUploadResourceFile() {
  return useMutation({
    mutationFn: ({ resourceId, file }: { resourceId: string; file: File }) =>
      adminResourcesService.uploadFile(resourceId, file),
  });
}
