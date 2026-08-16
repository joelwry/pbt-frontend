import { ShieldCheck, Users, UserX, KeyRound } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { AdminUsersStats } from "@/features/admin-users/types";

export function AdminUsersStatsRow({ stats }: { stats: AdminUsersStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={ShieldCheck}
        iconVariant="navy"
        topRight={<StatChip label="Full access" />}
        value={String(stats.superAdminsCount)}
        label="Super Admins"
        linkLabel="View"
        linkHref="/admin/admin-users?role=Super%20Admin"
      />
      <StatCard
        icon={Users}
        iconVariant="sky"
        topRight={<StatChip label="Active" />}
        value={String(stats.staffAccountsCount)}
        label="Staff Accounts"
        linkLabel="View all"
        linkHref="/admin/admin-users"
      />
      <StatCard
        icon={UserX}
        iconVariant="orange"
        topRight={<StatChip label="Pending" />}
        value={String(stats.invitedNotActiveCount)}
        label="Invited, Not Active"
        linkLabel="View all"
        linkHref="/admin/admin-users"
      />
      <StatCard
        icon={KeyRound}
        iconVariant="slate"
        topRight={<StatChip label="Last 30 days" />}
        value={String(stats.roleChangesCount)}
        label="Role Changes"
        linkLabel="View all"
        linkHref="/admin/admin-users"
      />
    </div>
  );
}
