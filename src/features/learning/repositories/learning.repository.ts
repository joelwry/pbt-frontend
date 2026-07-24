import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { YearOption, YearProgramme, Lesson, LearningModuleSummary } from "@/features/learning/types";
import {
  learningYearsMock,
  yearProgrammeMocks,
  lessonsByModuleId,
  yearModuleIds,
} from "@/features/learning/mocks/learning.mock";

const SIMULATED_LATENCY_MS = 450;

export class LearningNotFoundError extends Error {}

export interface LessonContext {
  lesson: Lesson;
  moduleId: string;
  moduleTitle: string;
  year: string;
  yearLabel: string;
  moduleLessons: Lesson[];
}

export const learningRepository = {
  async getYears(): Promise<ApiSuccess<YearOption[]>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return learningYearsMock;
  },

  /**
   * Returns programme metadata + module summaries only (no lesson bodies) —
   * lessons are fetched separately, one paginated page per module, so opening
   * a year never pulls a full programme's worth of content in one request.
   */
  async getYearProgramme(year: string): Promise<ApiSuccess<YearProgramme>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const match = yearProgrammeMocks[year];
    if (!match) throw new LearningNotFoundError(`No programme found for ${year}`);
    return match;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<YearProgramme>>(`/learning/${year}`);
    // return data;
  },

  async getModuleLessonsPage(moduleId: string, page: number, limit: number): Promise<ApiPaginated<Lesson>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const all = lessonsByModuleId[moduleId] ?? [];
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

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiPaginated<Lesson>>(`/learning/modules/${moduleId}/lessons`, { params: { page, limit } });
    // return data;
  },

  async getLessonContext(lessonId: string): Promise<ApiSuccess<LessonContext>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    for (const [year, moduleIds] of Object.entries(yearModuleIds)) {
      for (const moduleId of moduleIds) {
        const moduleLessons = lessonsByModuleId[moduleId] ?? [];
        const lesson = moduleLessons.find((l) => l.id === lessonId);
        if (lesson) {
          const moduleSummary: LearningModuleSummary | undefined = yearProgrammeMocks[year]?.data.modules.find(
            (m) => m.id === moduleId
          );
          return {
            success: true,
            message: "Lesson retrieved successfully",
            data: {
              lesson,
              moduleId,
              moduleTitle: moduleSummary?.title ?? "",
              year,
              yearLabel: yearProgrammeMocks[year]?.data.label ?? "",
              moduleLessons,
            },
          };
        }
      }
    }
    throw new LearningNotFoundError(`No lesson found for id ${lessonId}`);

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<LessonContext>>(`/learning/lessons/${lessonId}`);
    // return data;
  },
};
