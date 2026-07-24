export interface ProfileDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  investmentFocus: string;
  assignedLeader: string;
}

export interface NotificationPreferences {
  communityReplies: boolean;
  eventReminders: boolean;
  newModuleReleases: boolean;
  marketingUpdates: boolean;
}

export interface ProfileData {
  details: ProfileDetails;
  notifications: NotificationPreferences;
}

export const INVESTMENT_FOCUS_OPTIONS = [
  "HMO & Portfolio Growth",
  "Buy-to-Let Fundamentals",
  "Deal Sourcing",
  "Refinance & Finance",
  "Joint Ventures",
  "Commercial Conversions",
  "Serviced Accommodation",
] as const;
