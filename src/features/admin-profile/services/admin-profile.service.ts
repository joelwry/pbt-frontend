import { adminProfileRepository } from "@/features/admin-profile/repositories/admin-profile.repository";
import type { AdminProfileData, AdminNotificationPreferences, ChangePasswordInput } from "@/features/admin-profile/types";

export interface AdminSeed {
  fullName: string;
  email: string;
}

export const adminProfileService = {
  async getProfile(adminId: string, seed: AdminSeed): Promise<AdminProfileData> {
    const response = await adminProfileRepository.getProfile(adminId, seed);
    return response.data;
  },
  async updateDetails(adminId: string, seed: AdminSeed, details: AdminProfileData["details"]): Promise<AdminProfileData["details"]> {
    const response = await adminProfileRepository.updateDetails(adminId, seed, details);
    return response.data;
  },
  async updateNotificationPreference(
    adminId: string,
    seed: AdminSeed,
    key: keyof AdminNotificationPreferences,
    value: boolean
  ): Promise<AdminNotificationPreferences> {
    const response = await adminProfileRepository.updateNotificationPreference(adminId, seed, key, value);
    return response.data;
  },
  async changePassword(input: ChangePasswordInput): Promise<boolean> {
    const response = await adminProfileRepository.changePassword(input);
    return response.data.changed;
  },
};
