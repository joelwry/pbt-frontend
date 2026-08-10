import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { YearOption, Roadmap, Lesson } from "@/features/learning/types";
import type { MembershipTier } from "@/features/session/types";

export class LearningNotFoundError extends Error {}

export interface LessonContext {
  lesson: Lesson;
  moduleId: string;
  moduleTitle: string;
  moduleLessons: Lesson[];
}

interface BackendRoadmapYear {
  year: string;
  title: string;
  isCurrent: boolean;
}

export const learningRepository = {
  async getYears(): Promise<ApiSuccess<YearOption[]>> {
    const { data } = await apiClient.get<ApiSuccess<BackendRoadmapYear[]>>("/learning/years");
    return {
      success: true,
      message: data.message,
      data: data.data.map((r) => ({ year: r.year, label: r.title, isCurrent: r.isCurrent })),
    };
  },

  /**
   * `tier` restricts the whole roadmap to lessons written for exactly that
   * tier — the Pathway page passes 'Pathway' so Plus/Masterplan-only lessons
   * never load there at all (they live on their own dedicated pages), and
   * those dedicated pages reuse this same call with 'Plus' / 'Mentorship'.
   */
  async getRoadmap(year: string, tier: MembershipTier): Promise<ApiSuccess<Roadmap>> {
    const { data } = await apiClient.get<ApiSuccess<Roadmap>>(`/learning/roadmap/${year}`, { params: { tier } });
    return data;
  },

  async getContinueLearning(): Promise<ApiSuccess<Lesson[]>> {
    const { data } = await apiClient.get<ApiSuccess<Lesson[]>>("/learning/continue");
    return data;
  },

  /** Real server-side pagination — a module's lessons are no longer fetched all at once and sliced client-side. */
  async getModuleLessonsPage(moduleId: string, page: number, limit: number, tier: MembershipTier): Promise<ApiPaginated<Lesson>> {
    const { data } = await apiClient.get<ApiPaginated<Lesson>>(`/learning/modules/${moduleId}`, { params: { page, limit, tier } });
    return data;
  },

  async completeLesson(lessonId: string, moduleId: string, timeSpentMinutes: number): Promise<void> {
    await apiClient.post(`/learning/lessons/${lessonId}/progress`, {
      moduleId,
      status: "completed",
      progressPercent: 100,
      timeSpentMinutes,
    });
  },

  /** Wired to the existing /questions module -- a checkpoint week's "Submit a Question" tab. */
  async submitQuestion(title: string, description: string, category: string): Promise<void> {
    await apiClient.post("/questions", { title, description, category });
  },

  async getLessonContext(lessonId: string, tier: MembershipTier): Promise<ApiSuccess<LessonContext>> {
    const { data: lessonResponse } = await apiClient.get<
      ApiSuccess<Omit<Lesson, "moduleId"> & { moduleId: { _id: string; title: string } | string }>
    >(`/learning/lessons/${lessonId}`);
    const rawLesson = lessonResponse.data;
    const moduleId = typeof rawLesson.moduleId === "string" ? rawLesson.moduleId : rawLesson.moduleId._id;
    const moduleTitle = typeof rawLesson.moduleId === "string" ? "" : rawLesson.moduleId.title;

    // Full module context (not just one page) so prev/next navigation still
    // works across a module's entire lesson list, not just the first page.
    const { data: moduleLessonsResponse } = await apiClient.get<ApiPaginated<Lesson>>(`/learning/modules/${moduleId}`, {
      params: { page: 1, limit: 100, tier },
    });

    return {
      success: true,
      message: "Lesson retrieved successfully",
      data: {
        lesson: { ...rawLesson, moduleId },
        moduleId,
        moduleTitle,
        moduleLessons: moduleLessonsResponse.data,
      },
    };
  },
};
