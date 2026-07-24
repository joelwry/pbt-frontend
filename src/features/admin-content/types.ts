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

export const MODULE_OPTIONS = [
  { id: "mod_foundations", label: "Foundations of Property Investing" },
  { id: "mod_deal_structuring", label: "Deal Structuring & Finance" },
  { id: "mod_portfolio_growth", label: "Portfolio Growth & Scaling" },
] as const;
