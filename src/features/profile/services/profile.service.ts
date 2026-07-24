import { profileRepository } from "@/features/profile/repositories/profile.repository";
import type { ProfileData, ProfileDetails, NotificationPreferences } from "@/features/profile/types";

export const profileService = {
  async getProfile(): Promise<ProfileData> {
    const response = await profileRepository.getProfile();
    return response.data;
  },

  async updateDetails(details: ProfileDetails): Promise<ProfileDetails> {
    const response = await profileRepository.updateDetails(details);
    return response.data;
  },

  async updateNotificationPreference(key: keyof NotificationPreferences, value: boolean): Promise<NotificationPreferences> {
    const response = await profileRepository.updateNotificationPreference(key, value);
    return response.data;
  },
};
