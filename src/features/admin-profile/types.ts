export interface AdminProfileDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface AdminNotificationPreferences {
  flaggedContentAlerts: boolean;
  failedPaymentAlerts: boolean;
  weeklySummaryEmail: boolean;
}

export interface AdminProfileData {
  details: AdminProfileDetails;
  notifications: AdminNotificationPreferences;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
