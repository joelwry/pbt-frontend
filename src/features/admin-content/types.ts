export type AdminLessonType = "Video" | "Article" | "Download" | "Quiz";
export type AdminLessonStatus = "Published" | "Scheduled" | "Draft";
export type LessonVisibility = "all" | "plus-mentorship" | "mentorship";

export interface AdminLesson {
  id: string;
  title: string;
  moduleLabel: string; // "Deal Structuring · Month 10" (display)
  moduleId: string;
  programmeYear: string;
  type: AdminLessonType;
  durationLabel: string;
  description: string;
  unlockDate: string; // ISO date
  unlockTime: string; // "06:00"
  status: AdminLessonStatus;
  visibility: LessonVisibility;
}

export interface AdminContentStats {
  totalLessons: number;
  publishedCount: number;
  scheduledCount: number;
  modulesActiveCount: number;
}

// ---- Roadmap structure (Roadmap -> Roadmap Week -> Module) ----
// Managing these was a follow-up gap: the lesson editor needs a module to
// attach a lesson to, but nothing let an admin create one for a brand-new
// year without calling the API directly. See RoadmapStructureView.

export interface AdminRoadmap {
  id: string;
  title: string;
  year: string;
  description?: string;
  isCurrent: boolean;
}

export interface AdminRoadmapWeek {
  id: string;
  roadmapId: string;
  weekNumber: number;
  title: string;
  description?: string;
}

export interface AdminModuleItem {
  id: string;
  roadmapWeekId: string;
  moduleNumber: number;
  title: string;
  description?: string;
  lessonCount: number;
}
