import { BookOpen, CalendarClock, FolderOpen, Unlock } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { AdminContentStats } from "@/features/admin-content/types";
import type { AdminResourcesStats } from "@/features/admin-resources/types";

interface ContentManagerStatsRowProps {
  contentStats: AdminContentStats;
  resourcesStats: AdminResourcesStats;
  unlocksThisWeek: number;
}

export function ContentManagerStatsRow({ contentStats, resourcesStats, unlocksThisWeek }: ContentManagerStatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={BookOpen}
        iconVariant="navy"
        topRight={<StatChip label="Published" />}
        value={String(contentStats.totalLessons)}
        label="Total Lessons"
        linkLabel="Manage content"
        linkHref="/admin/content"
      />
      <StatCard
        icon={CalendarClock}
        iconVariant="sky"
        topRight={<StatChip label="This year" />}
        value={String(contentStats.scheduledCount)}
        label="Scheduled This Year"
        linkLabel="View schedule"
        linkHref="/admin/content"
      />
      <StatCard
        icon={FolderOpen}
        iconVariant="orange"
        topRight={<StatChip label="Live" />}
        value={String(resourcesStats.publishedTotal)}
        label="Resources Live"
        linkLabel="Manage resources"
        linkHref="/admin/resources"
      />
      <StatCard
        icon={Unlock}
        iconVariant="slate"
        topRight={<StatChip label="This week" />}
        value={String(unlocksThisWeek)}
        label="Unlocks This Week"
        linkLabel="View content"
        linkHref="/admin/content"
      />
    </div>
  );
}
