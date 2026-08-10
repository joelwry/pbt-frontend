export type AdminLessonType = "Video" | "Article" | "Download" | "Quiz";
export type AdminLessonStatus = "Published" | "Scheduled" | "Draft";
export type LessonVisibility = "all" | "plus-mentorship" | "mentorship";

export interface AdminQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

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
  /** Video type only -- set by the upload flow, read-only display. */
  videoUrl?: string;
  /** Video type only -- optional written transcript/summary shown under the player. */
  transcript?: string;
  /** Article type only -- the article's own formatted body. */
  articleHtml?: string;
  /** Download type only -- set by the upload flow, read-only display. */
  fileUrl?: string;
  /** Quiz type only. */
  questions?: AdminQuizQuestion[];
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
  /** A milestone week -- shown to members as a "Checkpoint Week" (review + video summary + submit a question) instead of ordinary modules. */
  isCheckpoint?: boolean;
}

export interface AdminModuleItem {
  id: string;
  roadmapWeekId: string;
  moduleNumber: number;
  title: string;
  description?: string;
  lessonCount: number;
}
