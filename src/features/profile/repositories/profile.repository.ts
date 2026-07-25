import { apiClient } from "@/lib/api-client";
import type { ApiSuccess } from "@/types/api";
import type { ProfileData, ProfileDetails, NotificationPreferences } from "@/features/profile/types";

interface BackendProfile {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  investmentFocus?: string;
  assignedLeader?: string;
  notificationPreferences: NotificationPreferences;
}

function toProfileData(profile: BackendProfile): ProfileData {
  return {
    details: {
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      investmentFocus: profile.investmentFocus ?? "",
      assignedLeader: profile.assignedLeader ?? "",
    },
    notifications: profile.notificationPreferences,
  };
}

export const profileRepository = {
  async getProfile(): Promise<ApiSuccess<ProfileData>> {
    const { data } = await apiClient.get<ApiSuccess<BackendProfile>>("/auth/me");
    return { success: true, message: data.message, data: toProfileData(data.data) };
  },

  async updateDetails(details: ProfileDetails): Promise<ApiSuccess<ProfileDetails>> {
    const { data } = await apiClient.patch<ApiSuccess<Omit<BackendProfile, "notificationPreferences">>>(
      "/auth/me",
      {
        fullName: details.fullName,
        email: details.email,
        phone: details.phone,
        location: details.location,
        investmentFocus: details.investmentFocus,
      }
    );

    return {
      success: true,
      message: data.message,
      data: {
        fullName: data.data.fullName,
        email: data.data.email,
        phone: data.data.phone ?? "",
        location: data.data.location ?? "",
        investmentFocus: data.data.investmentFocus ?? "",
        assignedLeader: data.data.assignedLeader ?? details.assignedLeader,
      },
    };
  },

  async updateNotificationPreference(
    key: keyof NotificationPreferences,
    value: boolean
  ): Promise<ApiSuccess<NotificationPreferences>> {
    const { data } = await apiClient.patch<ApiSuccess<NotificationPreferences>>("/auth/me/notifications", {
      key,
      value,
    });
    return { success: true, message: data.message, data: data.data };
  },
};
