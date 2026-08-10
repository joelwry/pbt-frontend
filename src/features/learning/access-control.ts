import type { Lesson, LessonStatus } from "@/features/learning/types";
import type { MembershipTier } from "@/features/session/types";

export interface ResolvedLesson extends Lesson {
  isLocked: boolean;
  resolvedStatus: LessonStatus;
  resolvedLockReason?: string;
}

/**
 * A lesson in My Learning is locked purely by its scheduled unlock date/time
 * — see docs/ui_adjustment.md: My Learning content is available to every
 * subscription tier, so `requiredTier` (still stored per-lesson for the
 * dedicated PBT Plus / Mentorship areas) is intentionally not enforced here.
 * This mirrors the backend's `canAccessLesson`, which is the real gate —
 * never trust the frontend lock state alone for authorization.
 */
export function resolveLessonAccess(lesson: Lesson, _memberTier: MembershipTier, now: Date = new Date()): ResolvedLesson {
  const unlockDate = new Date(lesson.access.unlocksAt);
  const isLocked = now < unlockDate;

  if (!isLocked) {
    return { ...lesson, isLocked: false, resolvedStatus: lesson.status === "locked" ? "not-started" : lesson.status };
  }

  const reason = `Unlocks ${unlockDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
  return { ...lesson, isLocked: true, resolvedStatus: "locked", resolvedLockReason: reason };
}
