import { adminDashboardRepository } from "@/features/admin-dashboard/repositories/admin-dashboard.repository";
import type { AdminDashboardData } from "@/features/admin-dashboard/types";

export const adminDashboardService = {
  async getDashboard(): Promise<AdminDashboardData> {
    const response = await adminDashboardRepository.getDashboard();
    return response.data;
  },
};
