import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminContentStats } from "@/features/admin-content/hooks/use-admin-content";
import { useAdminResourcesStats } from "@/features/admin-resources/hooks/use-admin-resources";
import { useContentManagerExtras } from "@/features/admin-staff-dashboard/hooks/use-admin-staff-dashboard";
import { ContentManagerStatsRow } from "@/features/admin-staff-dashboard/components/content-manager-stats-row";
import { YourTasksCard } from "@/features/admin-staff-dashboard/components/your-tasks-card";

export function ContentManagerDashboard() {
  const { data: contentStats, isLoading: contentLoading } = useAdminContentStats();
  const { data: resourcesStats, isLoading: resourcesLoading } = useAdminResourcesStats();
  const { data: extras, isLoading: extrasLoading } = useContentManagerExtras();

  const isLoading = contentLoading || resourcesLoading || extrasLoading;

  if (isLoading || !contentStats || !resourcesStats || !extras) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-10 w-10 rounded-xl mb-4" />
              <Skeleton className="h-7 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </Card>
          ))}
        </div>
        <Card>
          <Skeleton className="h-40 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ContentManagerStatsRow contentStats={contentStats} resourcesStats={resourcesStats} unlocksThisWeek={extras.unlocksThisWeek} />
      <YourTasksCard tasks={extras.tasks} />
    </div>
  );
}
