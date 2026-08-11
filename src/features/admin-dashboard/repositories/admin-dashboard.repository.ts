import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess } from "@/types/api";
import type { AdminDashboardData } from "@/features/admin-dashboard/types";

export const adminDashboardRepository = {
  async getDashboard(): Promise<ApiSuccess<AdminDashboardData>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminDashboardData>>("/admin/dashboard");
    return data;
  },
};
