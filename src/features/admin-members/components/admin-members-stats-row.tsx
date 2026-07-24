import { Users, UserPlus, XCircle, Lock } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { AdminMembersStats } from "@/features/admin-members/types";

export function AdminMembersStatsRow({ stats }: { stats: AdminMembersStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={Users}
        iconVariant="navy"
        topRight={<StatChip label={`↑ ${stats.totalMembersDeltaLabel}`} />}
        value={stats.totalMembers.toLocaleString()}
        label="Total Members"
        linkLabel="View all"
        linkHref="/admin/members"
      />
      <StatCard
        icon={UserPlus}
        iconVariant="navy"
        topRight={<StatChip label="This week" />}
        value={String(stats.newMembersThisWeek)}
        label="New Members"
        linkLabel="View new"
        linkHref="/admin/members"
      />
      <StatCard
        icon={XCircle}
        iconVariant="orange"
        topRight={<StatChip label="Needs review" />}
        value={String(stats.failedPayments)}
        label="Failed Payments"
        linkLabel="Review"
        linkHref="/admin/subscriptions"
      />
      <StatCard
        icon={Lock}
        iconVariant="slate"
        topRight={<StatChip label="This month" />}
        value={String(stats.pausedAccounts)}
        label="Paused Accounts"
        linkLabel="View paused"
        linkHref="/admin/members"
      />
    </div>
  );
}
