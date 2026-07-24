import { CheckCircle2, Clock, Lock, Sparkle } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { DashboardStats } from "@/features/dashboard/types";

export function StatsRow({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={CheckCircle2}
        iconVariant="navy"
        topRight={<StatChip label={stats.lessonsCompletedDeltaLabel} />}
        value={String(stats.lessonsCompleted)}
        label="Lessons Completed"
        linkLabel="View history"
        linkHref="/my-learning"
      />
      <StatCard
        icon={Clock}
        iconVariant="navy"
        topRight={<StatChip label={stats.studyHoursDeltaLabel} />}
        value={stats.studyHours.toString()}
        label="Study Hours"
        linkLabel="This month"
        linkHref="/my-learning"
      />
      <StatCard
        icon={Lock}
        iconVariant="orange"
        topRight={<StatChip label={`${stats.contentUnlocked} of ${stats.contentUnlockedTotal}`} />}
        value={String(stats.contentUnlocked)}
        label="Content Unlocked (2026)"
        linkLabel="View timeline"
        linkHref="/my-learning"
      />
      <StatCard
        icon={Sparkle}
        iconVariant="slate"
        topRight={<StatChip label={stats.nextUnlockLabel} />}
        value={`${stats.nextUnlockInDays} days`}
        label="Next Unlock In"
        linkLabel="See calendar"
        linkHref="/calendar"
      />
    </div>
  );
}
