import { adminContentRepository, type AdminLessonsQuery, type AdminModuleOption } from "@/features/admin-content/repositories/admin-content.repository";
import type { AdminLesson, AdminContentStats, AdminRoadmap, AdminRoadmapWeek, AdminModuleItem } from "@/features/admin-content/types";
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

  async getModuleOptions(): Promise<AdminModuleOption[]> {
    return adminContentRepository.getModuleOptions();
  },

  async getRoadmapYears(): Promise<string[]> {
    return adminContentRepository.getRoadmapYears();
  },

  async uploadLessonAsset(lessonId: string, file: File): Promise<string> {
    return adminContentRepository.uploadLessonAsset(lessonId, file);
  },

  // ---- Roadmap structure management ----
  listRoadmapsFull: () => adminContentRepository.listRoadmapsFull(),
  createRoadmap: (input: { title: string; year: string; description?: string; isCurrent: boolean }) =>
    adminContentRepository.createRoadmap(input),
  updateRoadmap: (id: string, input: { title: string; description?: string; isCurrent: boolean }) =>
    adminContentRepository.updateRoadmap(id, input),
  deleteRoadmap: (id: string) => adminContentRepository.deleteRoadmap(id),

  listWeeks: (roadmapId: string) => adminContentRepository.listWeeks(roadmapId),
  createWeek: (roadmapId: string, input: { weekNumber: number; title: string; description?: string }) =>
    adminContentRepository.createWeek(roadmapId, input),
  updateWeek: (weekId: string, input: { weekNumber: number; title: string; description?: string }) =>
    adminContentRepository.updateWeek(weekId, input),
  deleteWeek: (weekId: string) => adminContentRepository.deleteWeek(weekId),

  listModules: (weekId: string) => adminContentRepository.listModules(weekId),
  createModule: (weekId: string, input: { moduleNumber: number; title: string; description?: string }) =>
    adminContentRepository.createModule(weekId, input),
  updateModule: (moduleId: string, input: { moduleNumber: number; title: string; description?: string }) =>
    adminContentRepository.updateModule(moduleId, input),
  deleteModule: (moduleId: string) => adminContentRepository.deleteModule(moduleId),
};

export type { AdminRoadmap, AdminRoadmapWeek, AdminModuleItem };

export type { AdminModuleOption };
