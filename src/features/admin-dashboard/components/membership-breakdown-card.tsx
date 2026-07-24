import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DonutChart } from "@/components/shared/donut-chart";
import type { MembershipBreakdown } from "@/features/admin-dashboard/types";

const SEGMENT_COLOR: Record<string, string> = {
  Pathway: "#64748B",
  Plus: "#26AAE1",
  Mentorship: "#F18D00",
};

export function MembershipBreakdownCard({ breakdown }: { breakdown: MembershipBreakdown }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-text-primary">Membership Breakdown</h3>
          <p className="text-sm text-text-muted mt-1">Active members by tier</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-text-primary bg-white">
          {breakdown.yearLabel}
          <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
        </button>
      </div>

      <div className="flex items-center gap-8 flex-wrap sm:flex-nowrap">
        <DonutChart
          segments={breakdown.segments.map((s) => ({ key: s.tier, percent: s.percent, color: SEGMENT_COLOR[s.tier] }))}
          centerValue={breakdown.totalMembers.toLocaleString()}
          centerLabel="Members"
        />
        <ul className="space-y-3 flex-1 min-w-[180px]">
          {breakdown.segments.map((segment) => (
            <li key={segment.tier} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm text-text-secondary">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: SEGMENT_COLOR[segment.tier] }}
                />
                {segment.label}
              </span>
              <span className="text-sm font-semibold text-text-primary">{segment.percent}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
