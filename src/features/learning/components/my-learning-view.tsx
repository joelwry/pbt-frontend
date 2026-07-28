"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useLearningYears, useRoadmap, useContinueLearning } from "@/features/learning/hooks/use-learning";
import { MyLearningSkeleton } from "@/features/learning/components/my-learning-skeleton";
import { YearTabs } from "@/features/learning/components/year-tabs";
import { LearningToolbar } from "@/features/learning/components/learning-toolbar";
import { RoadmapSummaryCard } from "@/features/learning/components/roadmap-summary-card";
import { LessonCard } from "@/features/learning/components/lesson-card";
import { ModuleSection } from "@/features/learning/components/module-section";

export function MyLearningView() {
  const { data: years, isLoading: yearsLoading } = useLearningYears();
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const year = activeYear ?? years?.find((y) => y.isCurrent)?.year ?? years?.[0]?.year ?? "";
  const { data: roadmap, isLoading, isError, refetch } = useRoadmap(year);
  const { data: continueLearning } = useContinueLearning();

  const filteredWeeks = useMemo(() => {
    if (!roadmap) return [];
    if (!search.trim()) return roadmap.weeks;
    const q = search.trim().toLowerCase();
    return roadmap.weeks
      .map((week) => ({ ...week, modules: week.modules.filter((m) => m.title.toLowerCase().includes(q)) }))
      .filter((week) => week.modules.length > 0);
  }, [roadmap, search]);

  if (yearsLoading || (isLoading && !roadmap)) {
    return (
      <div className="space-y-6">
        <PageHeader title="PBT Pathway" description="Your growth roadmap, at your own pace — no fixed end date." />
        <MyLearningSkeleton />
      </div>
    );
  }

  if (isError || !roadmap || !years) {
    return (
      <div className="space-y-6">
        <PageHeader title="PBT Pathway" description="Your growth roadmap, at your own pace — no fixed end date." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="PBT Pathway" description="Your growth roadmap, at your own pace — no fixed end date." />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <YearTabs years={years} activeYear={year} onSelect={setActiveYear} />
        <LearningToolbar search={search} onSearchChange={setSearch} />
      </div>

      <RoadmapSummaryCard
        label={roadmap.title}
        note={roadmap.description ?? ""}
        percent={roadmap.overallPercent}
      />

      {!search.trim() && continueLearning && continueLearning.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-text-primary">Continue Where You Left Off</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {continueLearning.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </section>
      )}

      {filteredWeeks.length === 0 ? (
        <EmptyState icon={SearchX} title="No modules match your search" description="Try a different keyword." />
      ) : (
        <div className="space-y-12">
          {filteredWeeks.map((week) => (
            <section key={week.id} className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border pb-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-text-primary">
                    Week {week.weekNumber} · {week.title}
                  </h2>
                  {week.description && <p className="text-sm text-text-muted mt-0.5">{week.description}</p>}
                </div>
                <span className="text-xs font-semibold text-text-muted">{week.progressPercent}% complete</span>
              </div>

              <div className="space-y-10">
                {week.modules.map((learningModule) => (
                  <ModuleSection key={learningModule.id} moduleSummary={learningModule} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
