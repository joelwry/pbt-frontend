import { adminStaffDashboardRepository } from "@/features/admin-staff-dashboard/repositories/admin-staff-dashboard.repository";
import type { ContentManagerExtras } from "@/features/admin-staff-dashboard/types";

export const adminStaffDashboardService = {
  async getContentManagerExtras(): Promise<ContentManagerExtras> {
    const response = await adminStaffDashboardRepository.getContentManagerExtras();
    return response.data;
  },
};
