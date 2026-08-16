import { MapPin, Users, Award, Globe } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { AdminLeadersStats } from "@/features/admin-leaders/types";

export function AdminLeadersStatsRow({ stats }: { stats: AdminLeadersStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={MapPin}
        iconVariant="navy"
        topRight={<StatChip label="Active" />}
        value={String(stats.totalLeaders)}
        label="PBT Leaders"
        linkLabel="View all"
        linkHref="/admin/pbt-leaders"
      />
      <StatCard
        icon={Users}
        iconVariant="navy"
        topRight={<StatChip label="Assigned" />}
        value={String(stats.membersCovered)}
        label="Members Covered"
        linkLabel="View members"
        linkHref="/admin/members"
      />
      <StatCard
        icon={Award}
        iconVariant="orange"
        topRight={<StatChip label="2026" />}
        value={String(stats.topMentorCount)}
        label="Top Mentor"
        linkLabel="View all"
        linkHref="/admin/pbt-leaders"
      />
      <StatCard
        icon={Globe}
        iconVariant="slate"
        topRight={<StatChip label="Coverage" />}
        value={String(stats.regionsCount)}
        label="Regions"
        linkLabel="View all"
        linkHref="/admin/pbt-leaders"
      />
    </div>
  );
}
