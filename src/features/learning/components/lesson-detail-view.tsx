"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2, ChevronRight as Crumb } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLessonContext } from "@/features/learning/hooks/use-learning";
import { LessonBodyRenderer } from "@/features/learning/components/lesson-body-renderer";
import { LessonLockedState } from "@/features/learning/components/lesson-locked-state";
import { useState } from "react";

export function LessonDetailView({ lessonId }: { lessonId: string }) {
  const { data, isLoading, isError, refetch } = useLessonContext(lessonId);
  const [markedComplete, setMarkedComplete] = useState(false);

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

  const { lesson, moduleTitle, yearLabel, previousLesson, nextLesson } = data;
  const isComplete = markedComplete || lesson.resolvedStatus === "completed";

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-xs text-text-muted flex-wrap">
        <Link href="/my-learning" className="hover:text-text-primary hover:underline">
          My Learning
        </Link>
        <Crumb className="h-3 w-3" />
        <span>{yearLabel.replace(" Programme — Ongoing Membership", "").replace(" Programme — Completed", "")}</span>
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
                onClick={() => setMarkedComplete(true)}
                disabled={isComplete}
              >
                <CheckCircle2 className="h-4 w-4" />
                {isComplete ? "Completed" : "Mark as Complete"}
              </Button>
            }
          />

          <LessonBodyRenderer body={lesson.body} />

          <Card className="flex items-center justify-between gap-4 flex-wrap">
            <PrevNextLink direction="prev" lesson={previousLesson} />
            <PrevNextLink direction="next" lesson={nextLesson} />
          </Card>
        </>
      )}
    </div>
  );
}

function PrevNextLink({
  direction,
  lesson,
}: {
  direction: "prev" | "next";
  lesson: { id: string; title: string; isLocked: boolean } | null;
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

  return <Link href={`/my-learning/${lesson.id}`}>{content}</Link>;
}
