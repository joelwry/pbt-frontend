import type { ApiSuccess } from "@/types/api";
import type { ProfileData, ProfileDetails, NotificationPreferences } from "@/features/profile/types";
import { profileMock } from "@/features/profile/mocks/profile.mock";

const SIMULATED_LATENCY_MS = 400;
const store: ProfileData = JSON.parse(JSON.stringify(profileMock.data));

export const profileRepository = {
  async getProfile(): Promise<ApiSuccess<ProfileData>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return { success: true, message: "Profile retrieved successfully", data: store };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<ProfileData>>("/members/me/profile");
    // return data;
  },

  async updateDetails(details: ProfileDetails): Promise<ApiSuccess<ProfileDetails>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    store.details = details;
    return { success: true, message: "Profile updated successfully", data: store.details };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.patch<ApiSuccess<ProfileDetails>>("/members/me/profile", details);
    // return data;
  },

  async updateNotificationPreference(
    key: keyof NotificationPreferences,
    value: boolean
  ): Promise<ApiSuccess<NotificationPreferences>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    store.notifications[key] = value;
    return { success: true, message: "Preference updated successfully", data: store.notifications };
  },
};
