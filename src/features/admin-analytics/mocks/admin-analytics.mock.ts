import type { ApiSuccess } from "@/types/api";
import type {
  AnalyticsStats,
  MemberGrowthPoint,
  MembersByTier,
  ContentEngagementItem,
  EventAttendancePoint,
} from "@/features/admin-analytics/types";

export const analyticsStatsMock: ApiSuccess<AnalyticsStats> = {
  success: true,
  message: "Analytics stats retrieved successfully",
  data: {
    activeMembers: 1284,
    activeMembersDeltaLabel: "18 this month",
    contentCompletionPercent: 68,
    eventAttendancePercent: 82,
    membershipGrowthPercent: 24,
  },
};

export const memberGrowthMock: ApiSuccess<MemberGrowthPoint[]> = {
  success: true,
  message: "Member growth retrieved successfully",
  data: [
    { monthLabel: "Feb", newMembers: 84 },
    { monthLabel: "Mar", newMembers: 96 },
    { monthLabel: "Apr", newMembers: 110 },
    { monthLabel: "May", newMembers: 118 },
    { monthLabel: "Jun", newMembers: 132 },
    { monthLabel: "Jul", newMembers: 142 },
  ],
};

export const membersByTierMock: ApiSuccess<MembersByTier> = {
  success: true,
  message: "Members by tier retrieved successfully",
  data: {
    totalMembers: 1284,
    segments: [
      { tier: "Pathway", percent: 28 },
      { tier: "Plus", percent: 42 },
      { tier: "Mentorship", percent: 30 },
    ],
  },
};

export const contentEngagementMock: ApiSuccess<ContentEngagementItem[]> = {
  success: true,
  message: "Content engagement retrieved successfully",
  data: [
    { title: "Foundations of Property Investing", completionPercent: 92 },
    { title: "Deal Structuring & Finance", completionPercent: 68 },
    { title: "Portfolio Growth & Scaling", completionPercent: 34 },
  ],
};

export const eventAttendanceMock: ApiSuccess<EventAttendancePoint[]> = {
  success: true,
  message: "Event attendance retrieved successfully",
  data: [
    { eventLabel: "Q&A", attendeeCount: 89 },
    { eventLabel: "Workshop", attendeeCount: 34 },
    { eventLabel: "Meetup", attendeeCount: 22 },
    { eventLabel: "Call", attendeeCount: 112 },
  ],
};
