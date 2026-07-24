import Link from "next/link";
import { Play, FileText, Download, ListChecks, Clock3, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import type { ContinueLearningLesson, LessonType } from "@/features/dashboard/types";

const TYPE_ICON: Record<LessonType, typeof Play> = {
  Video: Play,
  Article: FileText,
  Download: Download,
  Quiz: ListChecks,
};

export function ContinueLearningCard({ lesson }: { lesson: ContinueLearningLesson | null }) {
  if (!lesson) {
    return (
      <Card>
        <h3 className="font-display text-lg font-semibold text-text-primary mb-4">Continue Learning</h3>
        <EmptyState
          icon={Lock}
          title="Nothing unlocked yet"
          description="Your next lesson will appear here as soon as it's unlocked on the programme schedule."
        />
      </Card>
    );
  }

  const TypeIcon = TYPE_ICON[lesson.type];

  return (
    <Card className="!p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <h3 className="font-display text-lg font-semibold text-text-primary">Continue Learning</h3>
        <Link href="/my-learning" className="text-xs font-semibold text-sky-600 hover:underline">
          View all →
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-0">
        <div className="relative w-full md:w-64 h-40 md:h-auto shrink-0 bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center mx-6 md:mx-6 mb-5 md:mb-6 rounded-2xl">
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white">
            <TypeIcon className="h-3 w-3" />
            {lesson.type}
          </span>
          <div className="h-12 w-12 rounded-full bg-white/15 flex items-center justify-center">
            <Play className="h-5 w-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
        <div className="flex-1 px-6 md:px-0 md:pr-6 pb-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-tint px-2.5 py-1 text-[11px] font-semibold text-orange-500">
            <Lock className="h-3 w-3" />
            {lesson.unlockedLabel}
          </span>
          <p className="text-xs text-text-muted mt-3">{lesson.category}</p>
          <h4 className="font-display text-xl font-bold text-text-primary mt-1">{lesson.title}</h4>
          <p className="text-sm text-text-muted mt-1">{lesson.availabilityLabel}</p>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-2 rounded-full bg-[#EDF1F4] overflow-hidden">
              <div className="h-full rounded-full bg-sky-500" style={{ width: `${lesson.progressPercent}%` }} />
            </div>
            <span className="text-xs font-semibold text-text-muted shrink-0">{lesson.progressPercent}%</span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
              <Clock3 className="h-3.5 w-3.5" />
              {lesson.timeLeftLabel}
            </span>
            <Button size="sm" asChild>
              <Link href="/my-learning">
                Continue
                <Play className="h-3.5 w-3.5" fill="currentColor" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
