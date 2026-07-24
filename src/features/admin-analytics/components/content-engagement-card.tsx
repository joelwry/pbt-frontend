import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentEngagement } from "@/features/admin-analytics/hooks/use-admin-analytics";

export function ContentEngagementCard() {
  const { data: items, isLoading } = useContentEngagement();

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-6">Content Engagement (2026)</h3>

      {isLoading || !items ? (
        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.title}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-sm font-medium text-text-primary">{item.title}</p>
                <span className="text-sm font-semibold text-text-primary shrink-0">{item.completionPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#EDF1F4] overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${item.completionPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
