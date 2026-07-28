"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, ChevronRight as Crumb } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompleteLesson, useLessonContext } from "@/features/learning/hooks/use-learning";
import { LessonBodyRenderer } from "@/features/learning/components/lesson-body-renderer";
import { LessonLockedState } from "@/features/learning/components/lesson-locked-state";
import type { MembershipTier } from "@/features/session/types";

interface LessonDetailViewProps {
  lessonId: string;
  contentTier?: MembershipTier;
  basePath?: string;
  homeLabel?: string;
}

export function LessonDetailView({
  lessonId,
  contentTier = "Pathway",
  basePath = "/pbt-pathway",
  homeLabel = "PBT Pathway",
}: LessonDetailViewProps) {
  const { data, isLoading, isError, refetch } = useLessonContext(lessonId, contentTier);
  const completeLesson = useCompleteLesson();

  // Elapsed time spent viewing this lesson, sent along with "Mark as
  // Complete" so UserLessonProgress.timeSpentMinutes (and, in turn, the
  // dashboard's totalLearningMinutes aggregate) reflects real activity
  // instead of always reading 0. Resets whenever the lesson id changes.
  // Set from an effect, not the useRef initializer — Date.now() is impure
  // and must not run during render.
  const viewStartRef = useRef<number | null>(null);
  useEffect(() => {
    viewStartRef.current = Date.now();
  }, [lessonId]);

  function elapsedMinutes(): number {
    if (viewStartRef.current === null) return 0;
    return Math.max(0, Math.round((Date.now() - viewStartRef.current) / 60000));
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-80 w-full rounded-[var(--radius-card)]" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const { lesson, moduleTitle, previousLesson, nextLesson } = data;
  const isComplete = completeLesson.isSuccess || lesson.resolvedStatus === "completed";

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-xs text-text-muted flex-wrap">
        <Link href={basePath} className="hover:text-text-primary hover:underline">
          {homeLabel}
        </Link>
        <Crumb className="h-3 w-3" />
        <span className="text-text-secondary font-medium">{moduleTitle}</span>
      </nav>

      {lesson.isLocked ? (
        <>
          <PageHeader title={lesson.title} description={`${lesson.category} · ${lesson.type}`} />
          <LessonLockedState reason={lesson.resolvedLockReason} />
        </>
      ) : (
        <>
          <PageHeader
            title={lesson.title}
            description={`${lesson.category} · ${lesson.metaLabel} · ${lesson.author}`}
            actions={
              <Button
                variant={isComplete ? "secondary" : "primary"}
                onClick={() =>
                  completeLesson.mutate({ lessonId: lesson.id, moduleId: lesson.moduleId, timeSpentMinutes: elapsedMinutes() })
                }
                disabled={isComplete || completeLesson.isPending}
              >
                <CheckCircle2 className="h-4 w-4" />
                {isComplete ? "Completed" : completeLesson.isPending ? "Saving…" : "Mark as Complete"}
              </Button>
            }
          />

          <LessonBodyRenderer body={lesson.body} />

          <Card className="flex items-center justify-between gap-4 flex-wrap">
            <PrevNextLink direction="prev" lesson={previousLesson} basePath={basePath} />
            <PrevNextLink direction="next" lesson={nextLesson} basePath={basePath} />
          </Card>
        </>
      )}
    </div>
  );
}

function PrevNextLink({
  direction,
  lesson,
  basePath,
}: {
  direction: "prev" | "next";
  lesson: { id: string; title: string; isLocked: boolean } | null;
  basePath: string;
}) {
  if (!lesson) {
    return <div />;
  }

  const disabled = lesson.isLocked;
  const content = (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${
        disabled ? "text-text-muted cursor-not-allowed" : "text-text-primary hover:text-sky-600"
      } ${direction === "next" ? "flex-row-reverse" : ""}`}
    >
      {direction === "prev" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      {lesson.title}
    </span>
  );

  if (disabled) return content;

  return <Link href={`${basePath}/${lesson.id}`}>{content}</Link>;
}
