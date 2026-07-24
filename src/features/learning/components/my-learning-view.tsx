"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useLearningYears, useYearProgramme } from "@/features/learning/hooks/use-learning";
import { MyLearningSkeleton } from "@/features/learning/components/my-learning-skeleton";
import { YearTabs } from "@/features/learning/components/year-tabs";
import { LearningToolbar } from "@/features/learning/components/learning-toolbar";
import { ProgrammeSummaryCard } from "@/features/learning/components/programme-summary-card";
import { LessonCard } from "@/features/learning/components/lesson-card";
import { ModuleSection } from "@/features/learning/components/module-section";

export function MyLearningView() {
  const { data: years, isLoading: yearsLoading } = useLearningYears();
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const year = activeYear ?? years?.find((y) => y.isCurrent)?.year ?? years?.[0]?.year ?? "";
  const { data: programme, isLoading, isError, refetch } = useYearProgramme(year);

  const filteredModules = useMemo(() => {
    if (!programme) return [];
    if (!search.trim()) return programme.modules;
    const q = search.trim().toLowerCase();
    return programme.modules.filter((m) => m.title.toLowerCase().includes(q));
  }, [programme, search]);

  if (yearsLoading || (isLoading && !programme)) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Learning" description="Your programme, at your own pace — no fixed end date." />
        <MyLearningSkeleton />
      </div>
    );
  }

  if (isError || !programme || !years) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Learning" description="Your programme, at your own pace — no fixed end date." />
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Learning" description="Your programme, at your own pace — no fixed end date." />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <YearTabs years={years} activeYear={year} onSelect={setActiveYear} />
        <LearningToolbar search={search} onSearchChange={setSearch} />
      </div>

      <ProgrammeSummaryCard label={programme.label} note={programme.note} percent={programme.overallPercent} />

      {!search.trim() && programme.continueWhereLeftOff.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-text-primary">Continue Where You Left Off</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {programme.continueWhereLeftOff.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </section>
      )}

      {filteredModules.length === 0 ? (
        <EmptyState icon={SearchX} title="No modules match your search" description="Try a different keyword." />
      ) : (
        <div className="space-y-10">
          {filteredModules.map((module) => (
            <ModuleSection key={module.id} moduleSummary={module} />
          ))}
        </div>
      )}
    </div>
  );
}
