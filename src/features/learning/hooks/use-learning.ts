import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { learningService } from "@/features/learning/services/learning.service";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import type { MembershipTier } from "@/features/session/types";

export function useLearningYears() {
  return useQuery({
    queryKey: ["learning", "years"],
    queryFn: learningService.getYears,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * `contentTier` selects which tier's own lesson pool this roadmap call
 * loads — 'Pathway' for the shared PBT Pathway page, 'Plus' / 'Mentorship'
 * for their own dedicated learning pages. Defaults to 'Pathway' since
 * that's the only page this hook served before the tier split.
 */
export function useRoadmap(year: string, contentTier: MembershipTier = "Pathway") {
  return useQuery({
    queryKey: ["learning", "roadmap", year, contentTier],
    queryFn: () => learningService.getRoadmap(year, contentTier),
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

export function useSubmitQuestion() {
  return useMutation({
    mutationFn: ({ title, description, category }: { title: string; description: string; category: string }) =>
      learningService.submitQuestion(title, description, category),
  });
}

const MODULE_LESSONS_PAGE_SIZE = 4;

export function useModuleLessons(
  moduleId: string,
  page: number,
  limit: number = MODULE_LESSONS_PAGE_SIZE,
  contentTier: MembershipTier = "Pathway"
) {
  const { data: member } = useCurrentMember();

  return useQuery({
    queryKey: ["learning", "module-lessons", moduleId, page, limit, contentTier, member?.membershipTier],
    queryFn: () => learningService.getModuleLessonsPage(moduleId, page, limit, member!.membershipTier, contentTier),
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

export function useLessonContext(lessonId: string, contentTier: MembershipTier = "Pathway") {
  const { data: member } = useCurrentMember();

  return useQuery({
    queryKey: ["learning", "lesson", lessonId, contentTier, member?.membershipTier],
    queryFn: () => learningService.getLessonContext(lessonId, member!.membershipTier, contentTier),
    enabled: Boolean(member) && Boolean(lessonId),
  });
}
