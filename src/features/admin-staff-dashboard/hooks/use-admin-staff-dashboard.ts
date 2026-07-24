import { useQuery } from "@tanstack/react-query";
import { adminStaffDashboardService } from "@/features/admin-staff-dashboard/services/admin-staff-dashboard.service";

export function useContentManagerExtras() {
  return useQuery({
    queryKey: ["admin", "staff-dashboard", "content-manager-extras"],
    queryFn: adminStaffDashboardService.getContentManagerExtras,
  });
}
