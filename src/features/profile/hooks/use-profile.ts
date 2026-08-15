import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/features/profile/services/profile.service";
import { PasswordError } from "@/features/profile/repositories/profile.repository";
import type { ProfileData, ProfileDetails, NotificationPreferences, ChangePasswordInput } from "@/features/profile/types";

const PROFILE_KEY = ["profile"];

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: profileService.getProfile,
  });
}

export function useUpdateProfileDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (details: ProfileDetails) => profileService.updateDetails(details),
    onSuccess: (details) => {
      queryClient.setQueryData<ProfileData>(PROFILE_KEY, (prev) => (prev ? { ...prev, details } : prev));
    },
  });
}

export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: keyof NotificationPreferences; value: boolean }) =>
      profileService.updateNotificationPreference(key, value),
    onSuccess: (notifications) => {
      queryClient.setQueryData<ProfileData>(PROFILE_KEY, (prev) => (prev ? { ...prev, notifications } : prev));
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => profileService.changePassword(input),
  });
}

export { PasswordError };
