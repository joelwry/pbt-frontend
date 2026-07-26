import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminContentService } from "@/features/admin-content/services/admin-content.service";
import type { AdminRoadmap, AdminRoadmapWeek, AdminModuleItem } from "@/features/admin-content/types";

export function useAdminRoadmapsFull() {
  return useQuery({
    queryKey: ["admin", "content", "roadmaps"],
    queryFn: adminContentService.listRoadmapsFull,
  });
}

export function useSaveRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id?: string; title: string; year: string; description?: string; isCurrent: boolean }) =>
      input.id
        ? adminContentService.updateRoadmap(input.id, input)
        : adminContentService.createRoadmap(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "roadmap-years"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "module-options"] });
    },
  });
}

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminContentService.deleteRoadmap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "roadmaps"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "roadmap-years"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "module-options"] });
    },
  });
}

export function useAdminWeeks(roadmapId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "content", "weeks", roadmapId],
    queryFn: () => adminContentService.listWeeks(roadmapId),
    enabled,
  });
}

export function useSaveWeek(roadmapId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id?: string; weekNumber: number; title: string; description?: string }) =>
      input.id ? adminContentService.updateWeek(input.id, input) : adminContentService.createWeek(roadmapId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "weeks", roadmapId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "module-options"] });
    },
  });
}

export function useDeleteWeek(roadmapId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (weekId: string) => adminContentService.deleteWeek(weekId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "weeks", roadmapId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "module-options"] });
    },
  });
}

export function useAdminModules(weekId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "content", "modules", weekId],
    queryFn: () => adminContentService.listModules(weekId),
    enabled,
  });
}

export function useSaveModule(weekId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id?: string; moduleNumber: number; title: string; description?: string }) =>
      input.id ? adminContentService.updateModule(input.id, input) : adminContentService.createModule(weekId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "modules", weekId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "module-options"] });
    },
  });
}

export function useDeleteModule(weekId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moduleId: string) => adminContentService.deleteModule(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "modules", weekId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "content", "module-options"] });
    },
  });
}

export type { AdminRoadmap, AdminRoadmapWeek, AdminModuleItem };
