import type { ApiSuccess } from "@/types/api";
import type { DashboardData } from "@/features/dashboard/types";
import { dashboardMock } from "@/features/dashboard/mocks/dashboard.mock";

const SIMULATED_LATENCY_MS = 500;

export const dashboardRepository = {
  async getDashboard(): Promise<ApiSuccess<DashboardData>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return dashboardMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<DashboardData>>("/dashboard");
    // return data;
  },
};
