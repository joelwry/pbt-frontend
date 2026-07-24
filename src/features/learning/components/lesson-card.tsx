import Link from "next/link";
import { Play, FileText, Download, ListChecks, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { ResolvedLesson } from "@/features/learning/access-control";
import type { LessonType } from "@/features/learning/types";

const TYPE_ICON: Record<LessonType, typeof Play> = {
  Video: Play,
  Article: FileText,
  PDF: Download,
  Quiz: ListChecks,
};

export function LessonCard({ lesson }: { lesson: ResolvedLesson }) {
  const TypeIcon = TYPE_ICON[lesson.type];
  const isQuiz = lesson.type === "Quiz";
  const isCompleted = lesson.resolvedStatus === "completed";

  const cardInner = (
    <Card
      className={cn(
        "!p-0 overflow-hidden h-full flex flex-col",
        !lesson.isLocked && "pbt-hover-lift cursor-pointer",
        lesson.isLocked && "opacity-70"
      )}
    >
      <div
        className={cn(
          "relative h-28 flex items-center justify-between px-4",
          isQuiz ? "bg-gradient-to-br from-orange-500 to-[#B96A00]" : "bg-gradient-to-br from-navy-950 to-navy-900"
        )}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white">
          <TypeIcon className="h-3 w-3" />
          {lesson.type}
        </span>
        {isCompleted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-[#15803D]">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        )}
        {lesson.isLocked && (
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-white/20">
            <Lock className="h-3.5 w-3.5 text-white" />
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] font-semibold tracking-wide text-text-muted uppercase">{lesson.category}</p>
        <h4 className="text-sm font-semibold text-text-primary mt-1 leading-snug line-clamp-2">{lesson.title}</h4>
        <p className="text-xs text-text-muted mt-1.5">
          {lesson.metaLabel} · {lesson.author}
        </p>

        <div className="mt-auto pt-3">
          {lesson.isLocked ? (
            <p className="text-[11px] font-medium text-text-muted flex items-center gap-1">
              <Lock className="h-3 w-3" />
              {lesson.resolvedLockReason}
            </p>
          ) : (
            <>
              <div className="h-1.5 rounded-full bg-[#EDF1F4] overflow-hidden">
                <div
                  className={cn("h-full rounded-full", isQuiz ? "bg-orange-500" : "bg-sky-500")}
                  style={{ width: `${lesson.progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">{lesson.progressPercent}% complete</p>
            </>
          )}
        </div>
      </div>
    </Card>
  );

  if (lesson.isLocked) {
    return <div aria-disabled="true">{cardInner}</div>;
  }

  return (
    <Link href={`/my-learning/${lesson.id}`} className="block h-full">
      {cardInner}
    </Link>
  );
}
