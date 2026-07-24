import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { learningService } from "@/features/learning/services/learning.service";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";

export function useLearningYears() {
  return useQuery({
    queryKey: ["learning", "years"],
    queryFn: learningService.getYears,
    staleTime: 10 * 60 * 1000,
  });
}

export function useYearProgramme(year: string) {
  const { data: member } = useCurrentMember();

  return useQuery({
    queryKey: ["learning", "year", year, member?.membershipTier],
    queryFn: () => learningService.getYearProgramme(year, member!.membershipTier),
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

export function useLessonContext(lessonId: string) {
  const { data: member } = useCurrentMember();

  return useQuery({
    queryKey: ["learning", "lesson", lessonId, member?.membershipTier],
    queryFn: () => learningService.getLessonContext(lessonId, member!.membershipTier),
    enabled: Boolean(member) && Boolean(lessonId),
  });
}
