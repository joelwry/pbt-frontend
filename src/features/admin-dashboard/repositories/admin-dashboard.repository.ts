import type { ApiSuccess } from "@/types/api";
import type { AdminDashboardData } from "@/features/admin-dashboard/types";
import { adminDashboardMock } from "@/features/admin-dashboard/mocks/admin-dashboard.mock";

const SIMULATED_LATENCY_MS = 500;

export const adminDashboardRepository = {
  async getDashboard(): Promise<ApiSuccess<AdminDashboardData>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return adminDashboardMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AdminDashboardData>>("/admin/dashboard");
    // return data;
  },
};
