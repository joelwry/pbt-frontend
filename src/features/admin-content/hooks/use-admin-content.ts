import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminContentService } from "@/features/admin-content/services/admin-content.service";
import type { AdminLesson } from "@/features/admin-content/types";

export function useAdminContentStats() {
  return useQuery({
    queryKey: ["admin", "content", "stats"],
    queryFn: adminContentService.getStats,
  });
}

export function useAdminLessonsPage(year: string | "All", search: string, page: number) {
  return useQuery({
    queryKey: ["admin", "content", "list", year, search, page],
    queryFn: () => adminContentService.getLessonsPage({ year, search, page, limit: 6 }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminLesson(id: string) {
  return useQuery({
    queryKey: ["admin", "content", "detail", id],
    queryFn: () => adminContentService.getLessonById(id),
    enabled: Boolean(id) && id !== "new",
  });
}

export function useSaveLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminLesson) => adminContentService.saveLesson(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminContentService.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content"] });
    },
  });
}

export function useAdminModuleOptions() {
  return useQuery({
    queryKey: ["admin", "content", "module-options"],
    queryFn: adminContentService.getModuleOptions,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminRoadmapYears() {
  return useQuery({
    queryKey: ["admin", "content", "roadmap-years"],
    queryFn: adminContentService.getRoadmapYears,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUploadLessonAsset() {
  return useMutation({
    mutationFn: ({ lessonId, file }: { lessonId: string; file: File }) =>
      adminContentService.uploadLessonAsset(lessonId, file),
  });
}
