import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DonutChart } from "@/components/shared/donut-chart";
import { useRevenueByTier } from "@/features/admin-subscriptions/hooks/use-admin-subscriptions";
import type { MembershipTier } from "@/features/admin-subscriptions/types";

const SEGMENT_COLOR: Record<MembershipTier, string> = {
  Pathway: "#64748B",
  Plus: "#26AAE1",
  Mentorship: "#F18D00",
};

export function RevenueByTierCard() {
  const { data: revenue, isLoading } = useRevenueByTier();

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary">Revenue by Tier</h3>
      <p className="text-sm text-text-muted mt-1 mb-6">Monthly recurring revenue split</p>

      {isLoading || !revenue ? (
        <div className="flex items-center gap-8 flex-wrap sm:flex-nowrap">
          <Skeleton className="h-[168px] w-[168px] rounded-full shrink-0" />
          <div className="space-y-3 flex-1 min-w-[200px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-8 flex-wrap sm:flex-nowrap">
          <DonutChart
            segments={revenue.segments.map((s) => ({ key: s.tier, percent: s.percent, color: SEGMENT_COLOR[s.tier] }))}
            centerValue={revenue.mrrLabel}
            centerLabel="MRR"
          />
          <ul className="space-y-3 flex-1 min-w-[200px]">
            {revenue.segments.map((segment) => (
              <li key={segment.tier} className="flex items-center justify-between gap-3 flex-wrap">
                <span className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: SEGMENT_COLOR[segment.tier] }} />
                  {segment.label}
                </span>
                <span className="text-sm font-semibold text-text-primary">{segment.percent}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
