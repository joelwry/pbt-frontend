import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess } from "@/types/api";
import type { SiteSettings } from "@/features/site-settings/types";

export const adminSiteSettingsRepository = {
  async getSettings(): Promise<ApiSuccess<SiteSettings>> {
    const { data } = await adminApiClient.get<ApiSuccess<SiteSettings>>("/site-settings");
    return data;
  },

  async updateSettings(updates: Partial<SiteSettings>): Promise<ApiSuccess<SiteSettings>> {
    const { data } = await adminApiClient.put<ApiSuccess<SiteSettings>>("/admin/site-settings", updates);
    return data;
  },
};
