import { learningRepository } from "@/features/learning/repositories/learning.repository";
import { resolveLessonAccess } from "@/features/learning/access-control";
import type { MembershipTier } from "@/features/session/types";
import type { YearOption, Roadmap, LearningModuleSummary } from "@/features/learning/types";
import type { ResolvedLesson } from "@/features/learning/access-control";
import type { Pagination } from "@/types/api";

export interface ResolvedRoadmap extends Omit<Roadmap, "weeks"> {
  weeks: Array<Roadmap["weeks"][number]>;
}

export interface ResolvedLessonPage {
  items: ResolvedLesson[];
  pagination: Pagination;
}

export interface ResolvedLessonContext {
  lesson: ResolvedLesson;
  moduleTitle: string;
  previousLesson: ResolvedLesson | null;
  nextLesson: ResolvedLesson | null;
}

export const learningService = {
  async getYears(): Promise<YearOption[]> {
    const response = await learningRepository.getYears();
    return response.data;
  },

  async getRoadmap(year: string, tier: MembershipTier): Promise<ResolvedRoadmap> {
    const response = await learningRepository.getRoadmap(year, tier);
    return response.data;
  },

  async submitQuestion(title: string, description: string, category: string): Promise<void> {
    await learningRepository.submitQuestion(title, description, category);
  },

  async getContinueLearning(memberTier: MembershipTier): Promise<ResolvedLesson[]> {
    const response = await learningRepository.getContinueLearning();
    return response.data.map((lesson) => resolveLessonAccess(lesson, memberTier));
  },

  async getModuleLessonsPage(moduleId: string, page: number, limit: number, memberTier: MembershipTier, contentTier: MembershipTier): Promise<ResolvedLessonPage> {
    const response = await learningRepository.getModuleLessonsPage(moduleId, page, limit, contentTier);
    return {
      items: response.data.map((lesson) => resolveLessonAccess(lesson, memberTier)),
      pagination: response.pagination,
    };
  },

  async completeLesson(lessonId: string, moduleId: string, timeSpentMinutes: number): Promise<void> {
    await learningRepository.completeLesson(lessonId, moduleId, timeSpentMinutes);
  },

  async getLessonContext(lessonId: string, memberTier: MembershipTier, contentTier: MembershipTier): Promise<ResolvedLessonContext> {
    const response = await learningRepository.getLessonContext(lessonId, contentTier);
    const { lesson, moduleTitle, moduleLessons } = response.data;

    const resolved = resolveLessonAccess(lesson, memberTier);
    const sorted = [...moduleLessons].sort((a, b) => a.month - b.month);
    const idx = sorted.findIndex((l) => l.id === lesson.id);
    const previousLesson = idx > 0 ? resolveLessonAccess(sorted[idx - 1], memberTier) : null;
    const nextLesson = idx >= 0 && idx < sorted.length - 1 ? resolveLessonAccess(sorted[idx + 1], memberTier) : null;

    return { lesson: resolved, moduleTitle, previousLesson, nextLesson };
  },
};

export type { LearningModuleSummary };
