import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DonutChart } from "@/components/shared/donut-chart";
import { useMembersByTier } from "@/features/admin-analytics/hooks/use-admin-analytics";
import type { MembershipTier } from "@/features/session/types";

const SEGMENT_COLOR: Record<MembershipTier, string> = {
  Pathway: "#64748B",
  Plus: "#26AAE1",
  Mentorship: "#F18D00",
};

export function MembersByTierCard() {
  const { data: breakdown, isLoading } = useMembersByTier();

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-6">Members by Tier</h3>

      {isLoading || !breakdown ? (
        <div className="flex items-center gap-8 flex-wrap sm:flex-nowrap">
          <Skeleton className="h-[168px] w-[168px] rounded-full shrink-0" />
          <div className="space-y-3 flex-1 min-w-[160px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-8 flex-wrap sm:flex-nowrap">
          <DonutChart
            segments={breakdown.segments.map((s) => ({ key: s.tier, percent: s.percent, color: SEGMENT_COLOR[s.tier] }))}
            centerValue={breakdown.totalMembers.toLocaleString()}
            centerLabel="Members"
          />
          <ul className="space-y-3 flex-1 min-w-[160px]">
            {breakdown.segments.map((segment) => (
              <li key={segment.tier} className="flex items-center justify-between gap-3 flex-wrap">
                <span className="flex items-center gap-2 text-sm text-text-secondary">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: SEGMENT_COLOR[segment.tier] }} />
                  {segment.tier}
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
