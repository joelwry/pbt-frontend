import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleBarChart } from "@/components/shared/simple-bar-chart";
import { useMemberGrowth } from "@/features/admin-analytics/hooks/use-admin-analytics";

export function MemberGrowthCard() {
  const { data: points, isLoading } = useMemberGrowth();

  return (
    <Card>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-text-primary">Member Growth</h3>
          <p className="text-sm text-text-muted mt-1">New members per month, 2026</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-text-primary bg-white">
          Last 6 months
          <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
        </button>
      </div>

      {isLoading || !points ? (
        <Skeleton className="h-[216px] w-full" />
      ) : (
        <SimpleBarChart data={points.map((p) => ({ label: p.monthLabel, value: p.newMembers }))} barColorClassName="bg-sky-500" />
      )}
    </Card>
  );
}
