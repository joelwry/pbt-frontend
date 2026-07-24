import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-64 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-10 w-10 rounded-xl mb-4" />
            <Skeleton className="h-7 w-16 mb-2" />
            <Skeleton className="h-4 w-28" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <Skeleton className="h-32 w-full" />
          </Card>
          <Card>
            <Skeleton className="h-40 w-full" />
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <Skeleton className="h-48 w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}
