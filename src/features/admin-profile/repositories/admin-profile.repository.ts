import type { ApiSuccess } from "@/types/api";
import type { AdminProfileData, AdminNotificationPreferences, ChangePasswordInput } from "@/features/admin-profile/types";
import { DEFAULT_NOTIFICATION_PREFERENCES, DEFAULT_PHONE } from "@/features/admin-profile/mocks/admin-profile.mock";

const SIMULATED_LATENCY_MS = 400;
const profileStore: Record<string, AdminProfileData> = {};

export class AdminPasswordError extends Error {}

function ensureProfile(adminId: string, seed: { fullName: string; email: string }): AdminProfileData {
  if (!profileStore[adminId]) {
    profileStore[adminId] = {
      details: { fullName: seed.fullName, email: seed.email, phone: DEFAULT_PHONE },
      notifications: { ...DEFAULT_NOTIFICATION_PREFERENCES },
    };
  }
  return profileStore[adminId];
}

export const adminProfileRepository = {
  async getProfile(adminId: string, seed: { fullName: string; email: string }): Promise<ApiSuccess<AdminProfileData>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return { success: true, message: "Admin profile retrieved successfully", data: ensureProfile(adminId, seed) };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AdminProfileData>>("/admin/me/profile");
    // return data;
  },

  async updateDetails(
    adminId: string,
    seed: { fullName: string; email: string },
    details: AdminProfileData["details"]
  ): Promise<ApiSuccess<AdminProfileData["details"]>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const profile = ensureProfile(adminId, seed);
    profile.details = details;
    return { success: true, message: "Profile updated successfully", data: profile.details };
  },

  async updateNotificationPreference(
    adminId: string,
    seed: { fullName: string; email: string },
    key: keyof AdminNotificationPreferences,
    value: boolean
  ): Promise<ApiSuccess<AdminNotificationPreferences>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const profile = ensureProfile(adminId, seed);
    profile.notifications[key] = value;
    return { success: true, message: "Preference updated successfully", data: profile.notifications };
  },

  async changePassword(input: ChangePasswordInput): Promise<ApiSuccess<{ changed: true }>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (input.currentPassword !== "password123") {
      throw new AdminPasswordError("Your current password is incorrect.");
    }
    return { success: true, message: "Password updated successfully", data: { changed: true } };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.post<ApiSuccess<{ changed: true }>>("/admin/me/change-password", input);
    // return data;
  },
};
