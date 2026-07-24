import { learningRepository } from "@/features/learning/repositories/learning.repository";
import { resolveLessonAccess } from "@/features/learning/access-control";
import type { MembershipTier } from "@/features/session/types";
import type { YearOption, YearProgramme, LearningModuleSummary } from "@/features/learning/types";
import type { ResolvedLesson } from "@/features/learning/access-control";
import type { Pagination } from "@/types/api";

export interface ResolvedYearProgramme extends Omit<YearProgramme, "continueWhereLeftOff"> {
  modules: LearningModuleSummary[];
  continueWhereLeftOff: ResolvedLesson[];
}

export interface ResolvedLessonPage {
  items: ResolvedLesson[];
  pagination: Pagination;
}

export interface ResolvedLessonContext {
  lesson: ResolvedLesson;
  moduleTitle: string;
  yearLabel: string;
  previousLesson: ResolvedLesson | null;
  nextLesson: ResolvedLesson | null;
}

export const learningService = {
  async getYears(): Promise<YearOption[]> {
    const response = await learningRepository.getYears();
    return response.data;
  },

  async getYearProgramme(year: string, memberTier: MembershipTier): Promise<ResolvedYearProgramme> {
    const response = await learningRepository.getYearProgramme(year);
    const programme = response.data;
    return {
      ...programme,
      continueWhereLeftOff: programme.continueWhereLeftOff.map((lesson) => resolveLessonAccess(lesson, memberTier)),
    };
  },

  async getModuleLessonsPage(moduleId: string, page: number, limit: number, memberTier: MembershipTier): Promise<ResolvedLessonPage> {
    const response = await learningRepository.getModuleLessonsPage(moduleId, page, limit);
    return {
      items: response.data.map((lesson) => resolveLessonAccess(lesson, memberTier)),
      pagination: response.pagination,
    };
  },

  async getLessonContext(lessonId: string, memberTier: MembershipTier): Promise<ResolvedLessonContext> {
    const response = await learningRepository.getLessonContext(lessonId);
    const { lesson, moduleTitle, yearLabel, moduleLessons } = response.data;

    const resolved = resolveLessonAccess(lesson, memberTier);
    const sorted = [...moduleLessons].sort((a, b) => a.month - b.month);
    const idx = sorted.findIndex((l) => l.id === lesson.id);
    const previousLesson = idx > 0 ? resolveLessonAccess(sorted[idx - 1], memberTier) : null;
    const nextLesson = idx >= 0 && idx < sorted.length - 1 ? resolveLessonAccess(sorted[idx + 1], memberTier) : null;

    return { lesson: resolved, moduleTitle, yearLabel, previousLesson, nextLesson };
  },
};
