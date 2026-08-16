import { Ticket, Users, MapPin, CheckCircle2 } from "lucide-react";
import { StatCard, StatChip } from "@/features/dashboard/components/stat-card";
import type { AdminEventsStats } from "@/features/admin-events/types";

export function AdminEventsStatsRow({ stats }: { stats: AdminEventsStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={Ticket}
        iconVariant="navy"
        topRight={<StatChip label="This month" />}
        value={String(stats.upcomingCount)}
        label="Upcoming Events"
        linkLabel="View all"
        linkHref="/admin/events"
      />
      <StatCard
        icon={Users}
        iconVariant="navy"
        topRight={<StatChip label="Across all events" />}
        value={String(stats.totalRsvps)}
        label="Total RSVPs"
        linkLabel="View events"
        linkHref="/admin/events"
      />
      <StatCard
        icon={MapPin}
        iconVariant="orange"
        topRight={<StatChip label={stats.inPersonNextLabel} />}
        value={String(stats.inPersonCount)}
        label="In-Person Events"
        linkLabel="View in-person"
        linkHref="/admin/events?tab=In-Person"
      />
      <StatCard
        icon={CheckCircle2}
        iconVariant="slate"
        topRight={<StatChip label={stats.yearLabel} />}
        value={String(stats.completedCount)}
        label="Completed Events"
        linkLabel="View completed"
        linkHref="/admin/events?tab=Past"
      />
    </div>
  );
}
