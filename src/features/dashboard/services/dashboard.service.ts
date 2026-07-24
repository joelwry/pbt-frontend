import { dashboardRepository } from "@/features/dashboard/repositories/dashboard.repository";
import type { DashboardData } from "@/features/dashboard/types";

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await dashboardRepository.getDashboard();
    return response.data;
  },
};
