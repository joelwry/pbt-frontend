import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function MyLearningSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-[var(--radius-card)]" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="!p-0 overflow-hidden">
            <Skeleton className="h-28 w-full rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
