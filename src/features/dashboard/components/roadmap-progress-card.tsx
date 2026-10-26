"use client";

import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/shared/donut-chart";
import type { RoadmapProgress } from "@/features/dashboard/types";

/* Matches the admin dashboard's tier breakdown palette -- the client asked
   for this card to use the same doughnuts the admin side already uses,
   rather than the bespoke single-arc ring that used to live here and never
   read as a pie at all. */
const SEGMENT_COLOR = {
  completed: "#22c55e",
  inProgress: "#26aae1",
  upcoming: "#cbd8e0",
} as const;

export function RoadmapProgressCard({ progress }: { progress: RoadmapProgress }) {
  /* Proportions of the year's content, so the ring shows the real shape of
     the journey rather than one arc. Guarded against a zero total: with no
     content yet, every segment is 0 and DonutChart renders its neutral
     track, which still looks like a doughnut instead of an empty box. */
  const total = progress.totalThisYear || 0;
  const share = (value: number) => (total > 0 ? (value / total) * 100 : 0);
  const donutSegments = [
    { key: "completed", percent: share(progress.completed), color: SEGMENT_COLOR.completed },
    { key: "inProgress", percent: share(progress.unlockedInProgress), color: SEGMENT_COLOR.inProgress },
    { key: "upcoming", percent: share(progress.upcoming), color: SEGMENT_COLOR.upcoming },
  ];

  const metrics = [
    { label: "Completed", value: progress.completed, color: SEGMENT_COLOR.completed },
    { label: "Unlocked, In Progress", value: progress.unlockedInProgress, color: SEGMENT_COLOR.inProgress },
    { label: "Upcoming", value: progress.upcoming, color: SEGMENT_COLOR.upcoming },
    { label: "Total This Year", value: progress.totalThisYear, color: null },
  ];

  return (
    <Card>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-text-primary">Roadmap Progress</h3>
          <p className="text-sm text-text-muted mt-1">
            Your learning journey (ongoing) — new content unlocks on schedule
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-text-primary bg-white">
          {progress.roadmapLabel}
        </span>
      </div>

      <div className="flex items-center gap-6 flex-wrap sm:flex-nowrap">
        <DonutChart
          segments={donutSegments}
          centerValue={`${progress.overallPercent}%`}
          centerLabel="Overall"
          size={132}
          strokeWidth={18}
          ariaLabel={`Roadmap progress: ${progress.overallPercent}% overall. ${progress.completed} completed, ${progress.unlockedInProgress} in progress, ${progress.upcoming} upcoming.`}
        />
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-medium text-text-primary">{progress.encouragement}</p>
          <div className="h-2 rounded-full bg-[#EDF1F4] mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-500"
              style={{ width: `${progress.overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7 pt-6 border-t border-border">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <p className="font-display text-2xl font-bold text-text-primary">{metric.value}</p>
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
              {metric.color && (
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: metric.color }} />
              )}
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
