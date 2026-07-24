import type { ApiSuccess } from "@/types/api";
import type {
  AnalyticsStats,
  MemberGrowthPoint,
  MembersByTier,
  ContentEngagementItem,
  EventAttendancePoint,
} from "@/features/admin-analytics/types";
import {
  analyticsStatsMock,
  memberGrowthMock,
  membersByTierMock,
  contentEngagementMock,
  eventAttendanceMock,
} from "@/features/admin-analytics/mocks/admin-analytics.mock";

const SIMULATED_LATENCY_MS = 500;

export const adminAnalyticsRepository = {
  async getStats(): Promise<ApiSuccess<AnalyticsStats>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return analyticsStatsMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AnalyticsStats>>("/admin/analytics/stats");
    // return data;
  },

  async getMemberGrowth(): Promise<ApiSuccess<MemberGrowthPoint[]>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return memberGrowthMock;
  },

  async getMembersByTier(): Promise<ApiSuccess<MembersByTier>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return membersByTierMock;
  },

  async getContentEngagement(): Promise<ApiSuccess<ContentEngagementItem[]>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return contentEngagementMock;
  },

  async getEventAttendance(): Promise<ApiSuccess<EventAttendancePoint[]>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return eventAttendanceMock;
  },
};
