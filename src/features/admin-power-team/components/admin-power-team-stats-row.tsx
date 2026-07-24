import { Handshake, Layers, Clock, Globe } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { AdminPowerTeamStats } from "@/features/admin-power-team/types";

export function AdminPowerTeamStatsRow({ stats }: { stats: AdminPowerTeamStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={Handshake}
        iconVariant="navy"
        topRight={<StatChip label="Verified" />}
        value={String(stats.totalPartners)}
        label="Partners"
        linkLabel="View all"
        linkHref="/admin/power-team"
      />
      <StatCard
        icon={Layers}
        iconVariant="navy"
        topRight={<StatChip label="Categories" />}
        value={String(stats.serviceTypesCount)}
        label="Service Types"
        linkLabel="View services"
        linkHref="/admin/power-team"
      />
      <StatCard
        icon={Clock}
        iconVariant="orange"
        topRight={<StatChip label="Awaiting review" />}
        value={String(stats.pendingCount)}
        label="Pending Verification"
        linkLabel="Review"
        linkHref="/admin/power-team"
      />
      <StatCard
        icon={Globe}
        iconVariant="slate"
        topRight={<StatChip label="Coverage" />}
        value={String(stats.regionsCount)}
        label="Regions"
        linkLabel="View regions"
        linkHref="/admin/power-team"
      />
    </div>
  );
}
