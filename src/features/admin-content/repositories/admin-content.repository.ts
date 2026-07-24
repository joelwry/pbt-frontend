import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminLesson, AdminContentStats } from "@/features/admin-content/types";
import { adminContentStatsMock, adminLessonsMock } from "@/features/admin-content/mocks/admin-content.mock";

const SIMULATED_LATENCY_MS = 500;
const lessonsStore: AdminLesson[] = [...adminLessonsMock];

export class AdminLessonNotFoundError extends Error {}

export interface AdminLessonsQuery {
  year: string | "All";
  search: string;
  page: number;
  limit: number;
}

export const adminContentRepository = {
  async getStats(): Promise<ApiSuccess<AdminContentStats>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return adminContentStatsMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AdminContentStats>>("/admin/content/stats");
    // return data;
  },

  async getLessonsPage(query: AdminLessonsQuery): Promise<ApiPaginated<AdminLesson>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    const filtered = lessonsStore.filter((lesson) => {
      const matchesYear = query.year === "All" || lesson.programmeYear === query.year;
      const matchesSearch =
        !q || lesson.title.toLowerCase().includes(q) || lesson.moduleLabel.toLowerCase().includes(q);
      return matchesYear && matchesSearch;
    });

    const start = (query.page - 1) * query.limit;
    const items = filtered.slice(start, start + query.limit);
    const totalPages = Math.max(1, Math.ceil(filtered.length / query.limit));

    return {
      success: true,
      data: items,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalItems: filtered.length,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiPaginated<AdminLesson>>("/admin/content", { params: query });
    // return data;
  },

  async getLessonById(id: string): Promise<ApiSuccess<AdminLesson>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const match = lessonsStore.find((l) => l.id === id);
    if (!match) throw new AdminLessonNotFoundError(`No lesson found for id ${id}`);
    return { success: true, message: "Lesson retrieved successfully", data: match };
  },

  async saveLesson(input: AdminLesson): Promise<ApiSuccess<AdminLesson>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const index = lessonsStore.findIndex((l) => l.id === input.id);
    if (index >= 0) {
      lessonsStore[index] = input;
    } else {
      lessonsStore.unshift(input);
    }
    return { success: true, message: "Lesson saved successfully", data: input };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.put<ApiSuccess<AdminLesson>>(`/admin/content/${input.id}`, input);
    // return data;
  },

  async deleteLesson(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = lessonsStore.findIndex((l) => l.id === id);
    if (index === -1) throw new AdminLessonNotFoundError(`No lesson found for id ${id}`);
    lessonsStore.splice(index, 1);
    return { success: true, message: "Lesson deleted", data: { deleted: true } };
  },
};
