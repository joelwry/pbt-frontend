import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type {
  AdminLesson,
  AdminLessonType,
  AdminContentStats,
  LessonVisibility,
  AdminRoadmap,
  AdminRoadmapWeek,
  AdminModuleItem,
} from "@/features/admin-content/types";

export class AdminLessonNotFoundError extends Error {}

export interface AdminLessonsQuery {
  year: string | "All";
  search: string;
  page: number;
  limit: number;
}

export interface AdminModuleOption {
  id: string;
  label: string;
  year: string;
}

type BackendLessonType = "Video" | "Article" | "PDF" | "Quiz";
type BackendTier = "Pathway" | "Plus" | "Mentorship";

interface BackendLessonBody {
  kind: "video" | "article" | "pdf" | "quiz";
  videoUrl?: string;
  durationLabel?: string;
  transcript?: string;
  readTimeLabel?: string;
  html?: string;
  pageCountLabel?: string;
  fileUrl?: string;
  summary?: string;
  questionCount?: number;
  questions?: unknown[];
}

interface BackendLesson {
  _id: string;
  moduleId: string;
  title: string;
  type: BackendLessonType;
  metaLabel: string;
  isDraft?: boolean;
  access: { unlocksAt: string; requiredTier: BackendTier };
  body: BackendLessonBody;
}

interface BackendLessonWithContext {
  lesson: BackendLesson;
  moduleTitle: string;
  weekNumber?: number;
  roadmapYear?: string;
}

interface BackendRoadmap {
  _id: string;
  title: string;
  year: string;
  description?: string;
  isCurrent: boolean;
}

interface BackendRoadmapWeek {
  _id: string;
  roadmapId: string;
  weekNumber: number;
  title: string;
  description?: string;
  isCheckpoint?: boolean;
}

interface BackendModule {
  _id: string;
  roadmapWeekId: string;
  moduleNumber: number;
  title: string;
  description?: string;
  lessons: string[];
}

function toAdminRoadmap(r: BackendRoadmap): AdminRoadmap {
  return { id: r._id, title: r.title, year: r.year, description: r.description, isCurrent: r.isCurrent };
}

function toAdminWeek(w: BackendRoadmapWeek): AdminRoadmapWeek {
  return {
    id: w._id,
    roadmapId: w.roadmapId,
    weekNumber: w.weekNumber,
    title: w.title,
    description: w.description,
    isCheckpoint: w.isCheckpoint ?? false,
  };
}

function toAdminModule(m: BackendModule): AdminModuleItem {
  return {
    id: m._id,
    roadmapWeekId: m.roadmapWeekId,
    moduleNumber: m.moduleNumber,
    title: m.title,
    description: m.description,
    lessonCount: m.lessons?.length ?? 0,
  };
}

// ---- Field mapping between the admin editor's UI-shaped AdminLesson and
// the backend's Lesson document. See the "Reconciling the admin-content
// mock shape with the real Lesson model" note in the PR description for why
// each mapping was chosen this way. ----

function backendTypeToAdminType(t: BackendLessonType): AdminLessonType {
  return t === "PDF" ? "Download" : t;
}

function adminTypeToBackendType(t: AdminLessonType): BackendLessonType {
  return t === "Download" ? "PDF" : t;
}

function tierToVisibility(tier: BackendTier): LessonVisibility {
  if (tier === "Mentorship") return "mentorship";
  if (tier === "Plus") return "plus-mentorship";
  return "all";
}

function visibilityToTier(v: LessonVisibility): BackendTier {
  if (v === "mentorship") return "Mentorship";
  if (v === "plus-mentorship") return "Plus";
  return "Pathway";
}

/** Local-time date/time parts, matching how the editor form re-combines them into a Date. */
function toLocalDateTimeParts(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

function statusOf(lesson: BackendLesson): AdminLesson["status"] {
  if (lesson.isDraft) return "Draft";
  return new Date(lesson.access.unlocksAt) <= new Date() ? "Published" : "Scheduled";
}

function toAdminLesson(item: BackendLessonWithContext): AdminLesson {
  const { lesson, moduleTitle, weekNumber, roadmapYear } = item;
  const { date, time } = toLocalDateTimeParts(lesson.access.unlocksAt);

  return {
    id: lesson._id,
    title: lesson.title,
    moduleLabel: weekNumber !== undefined ? `Week ${weekNumber} · ${moduleTitle}` : moduleTitle,
    moduleId: lesson.moduleId,
    programmeYear: roadmapYear ?? "",
    type: backendTypeToAdminType(lesson.type),
    durationLabel: lesson.metaLabel,
    description: lesson.body?.summary ?? "",
    unlockDate: date,
    unlockTime: time,
    status: statusOf(lesson),
    visibility: tierToVisibility(lesson.access.requiredTier),
  };
}

/** Builds the kind-specific body, preserving media fields an editor form never collects directly (video/file URLs come from the upload flow, not this form). */
function buildBody(adminType: AdminLessonType, description: string, durationLabel: string): Record<string, unknown> {
  const kind = adminType === "Video" ? "video" : adminType === "Article" ? "article" : adminType === "Download" ? "pdf" : "quiz";
  const body: Record<string, unknown> = { kind, summary: description };
  if (kind === "video") body.durationLabel = durationLabel;
  if (kind === "article") body.readTimeLabel = durationLabel;
  if (kind === "pdf") body.pageCountLabel = durationLabel;
  return body;
}

function toLessonWritePayload(input: AdminLesson) {
  return {
    title: input.title,
    type: adminTypeToBackendType(input.type),
    metaLabel: input.durationLabel,
    // Parsed the same way the editor form always has — as local time, not UTC
    // (the "(GMT)" field label is pre-existing UI copy, unrelated to this
    // integration pass).
    unlocksAt: `${input.unlockDate}T${input.unlockTime}`,
    requiredTier: visibilityToTier(input.visibility),
    isDraft: input.status === "Draft",
    body: buildBody(input.type, input.description, input.durationLabel),
  };
}

export const adminContentRepository = {
  async getStats(): Promise<ApiSuccess<AdminContentStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminContentStats>>("/admin/learning/lessons/stats");
    return data;
  },

  async getLessonsPage(query: AdminLessonsQuery): Promise<ApiPaginated<AdminLesson>> {
    const { data } = await adminApiClient.get<ApiPaginated<BackendLessonWithContext>>("/admin/learning/lessons", {
      params: { year: query.year, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return { success: true, data: data.data.map(toAdminLesson), pagination: data.pagination };
  },

  async getLessonById(id: string): Promise<ApiSuccess<AdminLesson>> {
    try {
      const { data } = await adminApiClient.get<ApiSuccess<BackendLessonWithContext>>(`/admin/learning/lessons/${id}`);
      return { success: true, message: data.message, data: toAdminLesson(data.data) };
    } catch {
      throw new AdminLessonNotFoundError(`No lesson found for id ${id}`);
    }
  },

  async saveLesson(input: AdminLesson): Promise<ApiSuccess<AdminLesson>> {
    const payload = toLessonWritePayload(input);

    const { data } = input.id
      ? await adminApiClient.patch<ApiSuccess<BackendLesson>>(`/admin/learning/lessons/${input.id}`, {
          ...payload,
          moduleId: input.moduleId,
        })
      : await adminApiClient.post<ApiSuccess<BackendLesson>>(`/admin/learning/modules/${input.moduleId}/lessons`, payload);

    // The create/update endpoints return the bare Lesson document (no joined
    // module/week/roadmap labels) — the editor form already knows those
    // (they're exactly what the user picked from the cascading selects), so
    // reuse them rather than a second round trip just to re-derive them.
    return {
      success: true,
      message: data.message,
      data: toAdminLesson({
        lesson: data.data,
        moduleTitle: input.moduleLabel,
        roadmapYear: input.programmeYear,
      }),
    };
  },

  async deleteLesson(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await adminApiClient.delete(`/admin/learning/lessons/${id}`);
    return { success: true, message: "Lesson deleted", data: { deleted: true } };
  },

  async uploadLessonAsset(lessonId: string, file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await adminApiClient.post<ApiSuccess<{ url: string }>>(
      `/admin/learning/lessons/${lessonId}/upload`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data.url;
  },

  /** Every roadmap year that exists, for the Content Management list's year filter. Unlike the member-facing picker, admins see future years too — they need to manage next year's content in advance. */
  async getRoadmapYears(): Promise<string[]> {
    const { data } = await adminApiClient.get<ApiSuccess<{ year: string }[]>>("/admin/learning/roadmaps");
    return data.data.map((r) => r.year).sort().reverse();
  },

  /** Roadmap → Week → Module, flattened for the editor's cascading Module select. Admins see every year, including future ones (unlike the member-facing year picker). */
  async getModuleOptions(): Promise<AdminModuleOption[]> {
    const { data: roadmapsRes } = await adminApiClient.get<ApiSuccess<{ _id: string; year: string }[]>>(
      "/admin/learning/roadmaps"
    );

    const perRoadmap = await Promise.all(
      roadmapsRes.data.map(async (roadmap) => {
        const { data: weeksRes } = await adminApiClient.get<ApiSuccess<{ _id: string; weekNumber: number }[]>>(
          `/admin/learning/roadmaps/${roadmap._id}/weeks`
        );

        const perWeek = await Promise.all(
          weeksRes.data.map(async (week) => {
            const { data: modulesRes } = await adminApiClient.get<ApiSuccess<{ _id: string; title: string; moduleNumber: number }[]>>(
              `/admin/learning/weeks/${week._id}/modules`
            );
            return modulesRes.data.map(
              (learningModule): AdminModuleOption => ({
                id: learningModule._id,
                // Week [N], Module [N] — [Title]: the year is already picked
                // one step earlier by the cascading select above this one, so
                // repeating it here just made two different modules in the
                // same week (a common case) look identical apart from title —
                // leading with both numbers disambiguates at a glance.
                label: `Week ${week.weekNumber}, Module ${learningModule.moduleNumber} — ${learningModule.title}`,
                year: roadmap.year,
              })
            );
          })
        );

        return perWeek.flat();
      })
    );

    return perRoadmap.flat();
  },

  // ---- Roadmap structure management (Roadmap -> Week -> Module) ----

  async listRoadmapsFull(): Promise<AdminRoadmap[]> {
    const { data } = await adminApiClient.get<ApiSuccess<BackendRoadmap[]>>("/admin/learning/roadmaps");
    return data.data.map(toAdminRoadmap);
  },

  async createRoadmap(input: { title: string; year: string; description?: string; isCurrent: boolean }): Promise<AdminRoadmap> {
    const { data } = await adminApiClient.post<ApiSuccess<BackendRoadmap>>("/admin/learning/roadmaps", input);
    return toAdminRoadmap(data.data);
  },

  async updateRoadmap(id: string, input: { title: string; description?: string; isCurrent: boolean }): Promise<AdminRoadmap> {
    const { data } = await adminApiClient.patch<ApiSuccess<BackendRoadmap>>(`/admin/learning/roadmaps/${id}`, input);
    return toAdminRoadmap(data.data);
  },

  async deleteRoadmap(id: string): Promise<void> {
    await adminApiClient.delete(`/admin/learning/roadmaps/${id}`);
  },

  async listWeeks(roadmapId: string): Promise<AdminRoadmapWeek[]> {
    const { data } = await adminApiClient.get<ApiSuccess<BackendRoadmapWeek[]>>(`/admin/learning/roadmaps/${roadmapId}/weeks`);
    return data.data.map(toAdminWeek);
  },

  async createWeek(roadmapId: string, input: { weekNumber: number; title: string; description?: string; isCheckpoint?: boolean }): Promise<AdminRoadmapWeek> {
    const { data } = await adminApiClient.post<ApiSuccess<BackendRoadmapWeek>>(`/admin/learning/roadmaps/${roadmapId}/weeks`, input);
    return toAdminWeek(data.data);
  },

  async updateWeek(weekId: string, input: { weekNumber: number; title: string; description?: string; isCheckpoint?: boolean }): Promise<AdminRoadmapWeek> {
    const { data } = await adminApiClient.patch<ApiSuccess<BackendRoadmapWeek>>(`/admin/learning/weeks/${weekId}`, input);
    return toAdminWeek(data.data);
  },

  async deleteWeek(weekId: string): Promise<void> {
    await adminApiClient.delete(`/admin/learning/weeks/${weekId}`);
  },

  async listModules(weekId: string): Promise<AdminModuleItem[]> {
    const { data } = await adminApiClient.get<ApiSuccess<BackendModule[]>>(`/admin/learning/weeks/${weekId}/modules`);
    return data.data.map(toAdminModule);
  },

  async createModule(weekId: string, input: { moduleNumber: number; title: string; description?: string }): Promise<AdminModuleItem> {
    const { data } = await adminApiClient.post<ApiSuccess<BackendModule>>(`/admin/learning/weeks/${weekId}/modules`, input);
    return toAdminModule(data.data);
  },

  async updateModule(moduleId: string, input: { moduleNumber: number; title: string; description?: string }): Promise<AdminModuleItem> {
    const { data } = await adminApiClient.patch<ApiSuccess<BackendModule>>(`/admin/learning/modules/${moduleId}`, input);
    return toAdminModule(data.data);
  },

  async deleteModule(moduleId: string): Promise<void> {
    await adminApiClient.delete(`/admin/learning/modules/${moduleId}`);
  },
};
