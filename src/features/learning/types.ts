import type { MembershipTier } from "@/features/session/types";

export type LessonType = "Video" | "Article" | "PDF" | "Quiz";

export type LessonStatus = "completed" | "in-progress" | "not-started" | "locked";

export interface LessonAccess {
  /** ISO datetime this lesson unlocks on the programme schedule. */
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

export interface YearProgramme {
  year: string;
  label: string;
  isCurrent: boolean;
  overallPercent: number;
  note: string;
  continueWhereLeftOff: Lesson[];
  modules: LearningModuleSummary[];
}

export interface YearOption {
  year: string;
  label: string;
  isCurrent: boolean;
}
