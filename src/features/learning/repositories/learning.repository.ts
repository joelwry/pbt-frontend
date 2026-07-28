import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { YearOption, Roadmap, Lesson } from "@/features/learning/types";

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

  async getRoadmap(year: string): Promise<ApiSuccess<Roadmap>> {
    const { data } = await apiClient.get<ApiSuccess<Roadmap>>(`/learning/roadmap/${year}`);
    return data;
  },

  async getContinueLearning(): Promise<ApiSuccess<Lesson[]>> {
    const { data } = await apiClient.get<ApiSuccess<Lesson[]>>("/learning/continue");
    return data;
  },

  /**
   * The backend returns a module's full lesson list in one call (modules are
   * small) — paginated here client-side to preserve the existing paged UI.
   */
  async getModuleLessonsPage(moduleId: string, page: number, limit: number): Promise<ApiPaginated<Lesson>> {
    const { data } = await apiClient.get<ApiSuccess<Lesson[]>>(`/learning/modules/${moduleId}`);
    const all = data.data;
    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(all.length / limit));

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        totalItems: all.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
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

  async getLessonContext(lessonId: string): Promise<ApiSuccess<LessonContext>> {
    const { data: lessonResponse } = await apiClient.get<
      ApiSuccess<Omit<Lesson, "moduleId"> & { moduleId: { _id: string; title: string } | string }>
    >(`/learning/lessons/${lessonId}`);
    const rawLesson = lessonResponse.data;
    const moduleId = typeof rawLesson.moduleId === "string" ? rawLesson.moduleId : rawLesson.moduleId._id;
    const moduleTitle = typeof rawLesson.moduleId === "string" ? "" : rawLesson.moduleId.title;

    const { data: moduleLessonsResponse } = await apiClient.get<ApiSuccess<Lesson[]>>(`/learning/modules/${moduleId}`);

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
