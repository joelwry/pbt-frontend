import type { ApiSuccess } from "@/types/api";
import type { ContentManagerExtras } from "@/features/admin-staff-dashboard/types";
import { contentManagerExtrasMock } from "@/features/admin-staff-dashboard/mocks/admin-staff-dashboard.mock";

const SIMULATED_LATENCY_MS = 400;

export const adminStaffDashboardRepository = {
  async getContentManagerExtras(): Promise<ApiSuccess<ContentManagerExtras>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return contentManagerExtrasMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<ContentManagerExtras>>("/admin/dashboard/content-manager-extras");
    // return data;
  },
};
