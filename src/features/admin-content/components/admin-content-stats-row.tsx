import { GraduationCap, CheckCircle2, CalendarClock, FolderOpen } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { AdminContentStats } from "@/features/admin-content/types";

export function AdminContentStatsRow({ stats }: { stats: AdminContentStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={GraduationCap}
        iconVariant="navy"
        topRight={<StatChip label="2026" />}
        value={String(stats.totalLessons)}
        label="Total Lessons"
        linkLabel="View all"
        linkHref="/admin/content"
      />
      <StatCard
        icon={CheckCircle2}
        iconVariant="navy"
        topRight={<StatChip label="Live now" />}
        value={String(stats.publishedCount)}
        label="Published"
        linkLabel="View lessons"
        linkHref="/admin/content"
      />
      <StatCard
        icon={CalendarClock}
        iconVariant="orange"
        topRight={<StatChip label="Upcoming" />}
        value={String(stats.scheduledCount)}
        label="Scheduled"
        linkLabel="View lessons"
        linkHref="/admin/content"
      />
      <StatCard
        icon={FolderOpen}
        iconVariant="slate"
        topRight={<StatChip label="This year" />}
        value={String(stats.modulesActiveCount)}
        label="Modules Active"
        linkLabel="View lessons"
        linkHref="/admin/content"
      />
    </div>
  );
}
