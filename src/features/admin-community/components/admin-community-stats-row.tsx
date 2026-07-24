import { MessageSquare, Flag, Pin, Users } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { CommunityStats } from "@/features/admin-community/types";

export function AdminCommunityStatsRow({ stats }: { stats: CommunityStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={MessageSquare}
        iconVariant="navy"
        topRight={<StatChip label={stats.totalPostsMonthLabel} />}
        value={String(stats.totalPosts)}
        label="Total Posts"
        linkLabel="View all"
        linkHref="/admin/community"
      />
      <StatCard
        icon={Flag}
        iconVariant="orange"
        topRight={<StatChip label="Needs review" />}
        value={String(stats.flaggedCount)}
        label="Flagged Posts"
        linkLabel="Review"
        linkHref="/admin/community"
      />
      <StatCard
        icon={Pin}
        iconVariant="navy"
        topRight={<StatChip label="Active" />}
        value={String(stats.pinnedCount)}
        label="Pinned Announcements"
        linkLabel="Manage"
        linkHref="/admin/community"
      />
      <StatCard
        icon={Users}
        iconVariant="slate"
        topRight={<StatChip label="Active" />}
        value={String(stats.groupsCount)}
        label="Community Groups"
        linkLabel="View groups"
        linkHref="/admin/community"
      />
    </div>
  );
}
