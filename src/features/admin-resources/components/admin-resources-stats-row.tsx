import { FolderOpen, FileDown, PlusCircle, Video } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { AdminResourcesStats } from "@/features/admin-resources/types";

export function AdminResourcesStatsRow({ stats }: { stats: AdminResourcesStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={FolderOpen}
        iconVariant="navy"
        topRight={<StatChip label="Total" />}
        value={String(stats.publishedTotal)}
        label="Resources Published"
        linkLabel="View all"
        linkHref="/admin/resources"
      />
      <StatCard
        icon={FileDown}
        iconVariant="navy"
        topRight={<StatChip label="This month" />}
        value={stats.totalDownloadsLabel}
        label="Total Downloads"
        linkLabel="View resources"
        linkHref="/admin/resources"
      />
      <StatCard
        icon={PlusCircle}
        iconVariant="orange"
        topRight={<StatChip label="In review" />}
        value={String(stats.draftsCount)}
        label="Drafts"
        linkLabel="View resources"
        linkHref="/admin/resources"
      />
      <StatCard
        icon={Video}
        iconVariant="slate"
        topRight={<StatChip label="Most used" />}
        value={stats.topCategoryLabel}
        label="Top Category"
        linkLabel="View category"
        linkHref={
          stats.topCategoryLabel === "None yet"
            ? "/admin/resources"
            : `/admin/resources?category=${encodeURIComponent(stats.topCategoryLabel)}`
        }
      />
    </div>
  );
}
