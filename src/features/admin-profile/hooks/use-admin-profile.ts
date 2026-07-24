import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminProfileService } from "@/features/admin-profile/services/admin-profile.service";
import { useAdminAuth } from "@/providers/admin-auth-provider";
import { AdminPasswordError } from "@/features/admin-profile/repositories/admin-profile.repository";
import type { AdminProfileData, AdminProfileDetails, AdminNotificationPreferences, ChangePasswordInput } from "@/features/admin-profile/types";

export function useAdminProfile() {
  const { admin } = useAdminAuth();
  const profileKey = ["admin", "profile", admin?.id];

  return useQuery({
    queryKey: profileKey,
    queryFn: () => adminProfileService.getProfile(admin!.id, { fullName: admin!.fullName, email: admin!.email }),
    enabled: Boolean(admin),
  });
}

export function useUpdateAdminProfileDetails() {
  const { admin } = useAdminAuth();
  const queryClient = useQueryClient();
  const profileKey = ["admin", "profile", admin?.id];

  return useMutation({
    mutationFn: (details: AdminProfileDetails) => adminProfileService.updateDetails(admin!.id, { fullName: admin!.fullName, email: admin!.email }, details),
    onSuccess: (details) => {
      queryClient.setQueryData<AdminProfileData>(profileKey, (prev) => (prev ? { ...prev, details } : prev));
    },
  });
}

export function useUpdateAdminNotificationPreference() {
  const { admin } = useAdminAuth();
  const queryClient = useQueryClient();
  const profileKey = ["admin", "profile", admin?.id];

  return useMutation({
    mutationFn: ({ key, value }: { key: keyof AdminNotificationPreferences; value: boolean }) =>
      adminProfileService.updateNotificationPreference(admin!.id, { fullName: admin!.fullName, email: admin!.email }, key, value),
    onSuccess: (notifications) => {
      queryClient.setQueryData<AdminProfileData>(profileKey, (prev) => (prev ? { ...prev, notifications } : prev));
    },
  });
}

export function useChangeAdminPassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => adminProfileService.changePassword(input),
  });
}

export { AdminPasswordError };
