"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { ErrorState } from "@/components/shared/error-state";
import { LessonCard } from "@/features/learning/components/lesson-card";
import { useModuleLessons } from "@/features/learning/hooks/use-learning";
import type { LearningModuleSummary } from "@/features/learning/types";

export function ModuleSection({ moduleSummary }: { moduleSummary: LearningModuleSummary }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, refetch } = useModuleLessons(moduleSummary.id, page);

  return (
    <section>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-display text-base font-semibold text-text-primary">
          Module {moduleSummary.moduleNumber} · {moduleSummary.title}
        </h3>
        <div className="flex items-center gap-2">
          {moduleSummary.badge?.kind === "complete" && <Badge variant="success">Complete</Badge>}
          {moduleSummary.badge?.kind === "progress" && <Badge variant="orange">{moduleSummary.badge.label}</Badge>}
          <span className="text-xs text-text-muted">
            {moduleSummary.lessonCount} lesson{moduleSummary.lessonCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: Math.min(4, moduleSummary.lessonCount) }).map((_, i) => (
            <Card key={i} className="!p-0 overflow-hidden">
              <Skeleton className="h-28 w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
          >
            {data.items.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} className="mt-5" />
        </>
      )}
    </section>
  );
}
