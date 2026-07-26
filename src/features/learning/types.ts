import type { MembershipTier } from "@/features/session/types";

export type LessonType = "Video" | "Article" | "PDF" | "Quiz";

export type LessonStatus = "completed" | "in-progress" | "not-started" | "locked";

export interface LessonAccess {
  /** ISO datetime this lesson unlocks on the roadmap schedule. */
  unlocksAt: string;
  /** Minimum membership tier required to view this lesson, once unlocked. */
  requiredTier: MembershipTier;
}

export interface Lesson {
  id: string;
  moduleId: string;
  month: number;
  category: string;
  title: string;
  type: LessonType;
  author: string;
  metaLabel: string; // "32 min", "8 min read", "10 questions", "4-page template"
  progressPercent: number;
  status: LessonStatus;
  access: LessonAccess;
  /** Present only when status === 'locked'; human-readable reason. */
  lockReason?: string;
  /** Rich body used on the lesson detail page. */
  body: LessonBody;
}

export type LessonBody =
  | { kind: "video"; videoUrl: string; durationLabel: string; transcript: string }
  | { kind: "article"; readTimeLabel: string; html: string }
  | { kind: "pdf"; pageCountLabel: string; fileUrl: string; summary: string }
  | { kind: "quiz"; questionCount: number; questions: QuizQuestion[] };

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export type ModuleBadge = { kind: "complete" } | { kind: "progress"; label: string } | null;

export interface LearningModuleSummary {
  id: string;
  moduleNumber: number;
  title: string;
  badge: ModuleBadge;
  lessonCount: number;
}

/** A time-boxed section of a Roadmap — see pbt_phase3_intgration_guide.md. */
export interface RoadmapWeekSummary {
  id: string;
  weekNumber: number;
  title: string;
  description?: string;
  progressPercent: number;
  modules: LearningModuleSummary[];
}

/** The Business Learning Journey for a given year — members progress through this, they don't enrol in it. */
export interface Roadmap {
  year: string;
  title: string;
  description?: string;
  overallPercent: number;
  weeks: RoadmapWeekSummary[];
}

export interface YearOption {
  year: string;
  label: string;
  isCurrent: boolean;
}
