import { apiClient } from "@/lib/api-client";
import type { ApiSuccess } from "@/types/api";
import type { SiteSettings } from "@/features/site-settings/types";

export const siteSettingsRepository = {
  async getSettings(): Promise<ApiSuccess<SiteSettings>> {
    const { data } = await apiClient.get<ApiSuccess<SiteSettings>>("/site-settings");
    return data;
  },
};
