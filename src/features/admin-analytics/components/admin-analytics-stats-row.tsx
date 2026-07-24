import { Users, CheckCircle2, Ticket, TrendingUp } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { AnalyticsStats } from "@/features/admin-analytics/types";

export function AdminAnalyticsStatsRow({ stats }: { stats: AnalyticsStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        iconVariant="navy"
        topRight={<StatChip label={stats.activeMembersDeltaLabel} />}
        value={stats.activeMembers.toLocaleString()}
        label="Active Members"
        linkLabel="View members"
        linkHref="/admin/members"
      />
      <StatCard
        icon={CheckCircle2}
        iconVariant="sky"
        topRight={<StatChip label="Avg. per member" />}
        value={`${stats.contentCompletionPercent}%`}
        label="Content Completion Rate"
        linkLabel="View content"
        linkHref="/admin/content"
      />
      <StatCard
        icon={Ticket}
        iconVariant="orange"
        topRight={<StatChip label="Last 90 days" />}
        value={`${stats.eventAttendancePercent}%`}
        label="Event Attendance Rate"
        linkLabel="View events"
        linkHref="/admin/events"
      />
      <StatCard
        icon={TrendingUp}
        iconVariant="slate"
        topRight={<StatChip label="Year over year" />}
        value={`${stats.membershipGrowthPercent}%`}
        label="Membership Growth"
        linkLabel="View trend"
        linkHref="/admin/analytics"
      />
    </div>
  );
}
