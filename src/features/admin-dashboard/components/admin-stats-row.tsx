import { Users, CreditCard, GraduationCap, MessageSquare } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { AdminDashboardStats } from "@/features/admin-dashboard/types";

export function AdminStatsRow({ stats }: { stats: AdminDashboardStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        iconVariant="navy"
        topRight={<StatChip label={stats.activeMembersDeltaLabel} />}
        value={stats.activeMembers.toLocaleString()}
        label="Active Members"
        linkLabel="View all"
        linkHref="/admin/members"
      />
      <StatCard
        icon={CreditCard}
        iconVariant="navy"
        topRight={<StatChip label={stats.mrrDeltaLabel} />}
        value={stats.mrrLabel}
        label="Monthly Recurring Revenue"
        linkLabel="View billing"
        linkHref="/admin/subscriptions"
      />
      <StatCard
        icon={GraduationCap}
        iconVariant="orange"
        topRight={<StatChip label={stats.lessonsUnlockThisWeekLabel} />}
        value={String(stats.lessonsPublished)}
        label={stats.lessonsPublishedYearLabel}
        linkLabel="Manage content"
        linkHref="/admin/content"
      />
      <StatCard
        icon={MessageSquare}
        iconVariant="slate"
        topRight={<StatChip label={stats.communityPostsTodayLabel} />}
        value={String(stats.communityPosts)}
        label="Community Posts This Month"
        linkLabel="Moderate"
        linkHref="/admin/community"
      />
    </div>
  );
}
