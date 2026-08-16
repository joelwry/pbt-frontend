import { Wallet, Users, XCircle, TrendingUp } from "lucide-react";
import { StatCard, StatChip, StatDelta } from "@/features/dashboard/components/stat-card";
import type { SubscriptionStats } from "@/features/admin-subscriptions/types";

export function AdminSubscriptionsStatsRow({ stats }: { stats: SubscriptionStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        icon={Wallet}
        iconVariant="navy"
        topRight={<StatDelta label={stats.mrrDeltaLabel} />}
        value={`£${stats.mrr.toLocaleString()}`}
        label="Monthly Recurring Revenue"
        linkLabel="View breakdown"
        linkHref="/admin/subscriptions"
      />
      <StatCard
        icon={Users}
        iconVariant="navy"
        topRight={<StatChip label="Active" />}
        value={stats.payingMembers.toLocaleString()}
        label="Paying Members"
        linkLabel="View members"
        linkHref="/admin/members"
      />
      <StatCard
        icon={XCircle}
        iconVariant="orange"
        topRight={<StatChip label="This month" />}
        value={String(stats.failedPaymentsCount)}
        label="Failed Payments"
        linkLabel="Review"
        linkHref="/admin/subscriptions?status=Failed"
      />
      <StatCard
        icon={TrendingUp}
        iconVariant="slate"
        topRight={<StatChip label="Last 90 days" />}
        value={`${stats.churnRatePercent}%`}
        label="Churn Rate"
        linkLabel="View trend"
        linkHref="/admin/subscriptions"
      />
    </div>
  );
}
