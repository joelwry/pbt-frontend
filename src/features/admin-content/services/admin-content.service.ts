import { adminContentRepository, type AdminLessonsQuery } from "@/features/admin-content/repositories/admin-content.repository";
import type { AdminLesson, AdminContentStats } from "@/features/admin-content/types";
import type { Pagination } from "@/types/api";

export interface AdminLessonsPage {
  items: AdminLesson[];
  pagination: Pagination;
}

export const adminContentService = {
  async getStats(): Promise<AdminContentStats> {
    const response = await adminContentRepository.getStats();
    return response.data;
  },

  async getLessonsPage(query: AdminLessonsQuery): Promise<AdminLessonsPage> {
    const response = await adminContentRepository.getLessonsPage(query);
    return { items: response.data, pagination: response.pagination };
  },

  async getLessonById(id: string): Promise<AdminLesson> {
    const response = await adminContentRepository.getLessonById(id);
    return response.data;
  },

  async saveLesson(input: AdminLesson): Promise<AdminLesson> {
    const response = await adminContentRepository.saveLesson(input);
    return response.data;
  },

  async deleteLesson(id: string): Promise<boolean> {
    const response = await adminContentRepository.deleteLesson(id);
    return response.data.deleted;
  },
};
