import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { learningService } from "@/features/learning/services/learning.service";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";

export function useLearningYears() {
  return useQuery({
    queryKey: ["learning", "years"],
    queryFn: learningService.getYears,
    staleTime: 10 * 60 * 1000,
  });
}

export function useRoadmap(year: string) {
  return useQuery({
    queryKey: ["learning", "roadmap", year],
    queryFn: () => learningService.getRoadmap(year),
    enabled: Boolean(year),
  });
}

export function useContinueLearning() {
  const { data: member } = useCurrentMember();

  return useQuery({
    queryKey: ["learning", "continue", member?.membershipTier],
    queryFn: () => learningService.getContinueLearning(member!.membershipTier),
    enabled: Boolean(member),
  });
}

const MODULE_LESSONS_PAGE_SIZE = 4;

export function useModuleLessons(moduleId: string, page: number, limit: number = MODULE_LESSONS_PAGE_SIZE) {
  const { data: member } = useCurrentMember();

  return useQuery({
    queryKey: ["learning", "module-lessons", moduleId, page, limit, member?.membershipTier],
    queryFn: () => learningService.getModuleLessonsPage(moduleId, page, limit, member!.membershipTier),
    enabled: Boolean(member) && Boolean(moduleId),
    placeholderData: keepPreviousData,
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, moduleId, timeSpentMinutes }: { lessonId: string; moduleId: string; timeSpentMinutes: number }) =>
      learningService.completeLesson(lessonId, moduleId, timeSpentMinutes),
    onSuccess: () => {
      // Completion changes the lesson's own state, its module's progress
      // badge, the roadmap's overall percent, and where Continue Learning
      // points next — all downstream of the one write, so refetch them all.
      queryClient.invalidateQueries({ queryKey: ["learning"] });
    },
  });
}

export function useLessonContext(lessonId: string) {
  const { data: member } = useCurrentMember();

  return useQuery({
    queryKey: ["learning", "lesson", lessonId, member?.membershipTier],
    queryFn: () => learningService.getLessonContext(lessonId, member!.membershipTier),
    enabled: Boolean(member) && Boolean(lessonId),
  });
}
