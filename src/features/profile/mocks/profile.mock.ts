import type { ApiSuccess } from "@/types/api";
import type { ProfileData } from "@/features/profile/types";

export const profileMock: ApiSuccess<ProfileData> = {
  success: true,
  message: "Profile retrieved successfully",
  data: {
    details: {
      fullName: "Kudirat Olowosale",
      email: "kudirat@olowosaleproperty.co.uk",
      phone: "+44 7700 900123",
      location: "Manchester, United Kingdom",
      investmentFocus: "HMO & Portfolio Growth",
      assignedLeader: "Michael Adeyemi",
    },
    notifications: {
      communityReplies: true,
      eventReminders: true,
      newModuleReleases: true,
      marketingUpdates: false,
    },
  },
};
