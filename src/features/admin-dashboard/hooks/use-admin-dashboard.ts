import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "@/features/admin-dashboard/services/admin-dashboard.service";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminDashboardService.getDashboard,
  });
}
