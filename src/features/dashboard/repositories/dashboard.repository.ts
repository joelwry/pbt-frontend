import { apiClient } from "@/lib/api-client";
import type { ApiSuccess } from "@/types/api";
import type { DashboardData } from "@/features/dashboard/types";

export const dashboardRepository = {
  async getDashboard(): Promise<ApiSuccess<DashboardData>> {
    const { data } = await apiClient.get<ApiSuccess<DashboardData>>("/dashboard");
    return data;
  },
};
