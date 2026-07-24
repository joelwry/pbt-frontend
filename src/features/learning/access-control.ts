import type { Lesson, LessonStatus } from "@/features/learning/types";
import type { MembershipTier } from "@/features/session/types";
import { TIER_RANK } from "@/features/session/tier-rank";

export interface ResolvedLesson extends Lesson {
  isLocked: boolean;
  resolvedStatus: LessonStatus;
  resolvedLockReason?: string;
}

/**
 * A lesson is locked when either:
 *  - its scheduled unlock date/time hasn't passed yet, or
 *  - the member's current membership tier doesn't meet the lesson's required tier.
 * This runs client-side against mock data today, but is the exact rule the
 * backend must enforce server-side once the real API exists (never trust the
 * frontend lock state alone for authorization).
 */
export function resolveLessonAccess(lesson: Lesson, memberTier: MembershipTier, now: Date = new Date()): ResolvedLesson {
  const unlockDate = new Date(lesson.access.unlocksAt);
  const notYetReleased = now < unlockDate;
  const tierTooLow = TIER_RANK[memberTier] < TIER_RANK[lesson.access.requiredTier];
  const isLocked = notYetReleased || tierTooLow;

  if (!isLocked) {
    return { ...lesson, isLocked: false, resolvedStatus: lesson.status === "locked" ? "not-started" : lesson.status };
  }

  const reason = tierTooLow
    ? `Requires PBT ${lesson.access.requiredTier} or higher`
    : `Unlocks ${unlockDate.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

  return { ...lesson, isLocked: true, resolvedStatus: "locked", resolvedLockReason: reason };
}
