import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess } from "@/types/api";
import type {
  AnalyticsStats,
  MemberGrowthPoint,
  MembersByTier,
  ContentEngagementItem,
  EventAttendancePoint,
} from "@/features/admin-analytics/types";

export const adminAnalyticsRepository = {
  async getStats(): Promise<ApiSuccess<AnalyticsStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<AnalyticsStats>>("/admin/analytics/stats");
    return data;
  },

  async getMemberGrowth(): Promise<ApiSuccess<MemberGrowthPoint[]>> {
    const { data } = await adminApiClient.get<ApiSuccess<MemberGrowthPoint[]>>("/admin/analytics/member-growth");
    return data;
  },

  async getMembersByTier(): Promise<ApiSuccess<MembersByTier>> {
    const { data } = await adminApiClient.get<ApiSuccess<MembersByTier>>("/admin/analytics/members-by-tier");
    return data;
  },

  async getContentEngagement(): Promise<ApiSuccess<ContentEngagementItem[]>> {
    const { data } = await adminApiClient.get<ApiSuccess<ContentEngagementItem[]>>("/admin/analytics/content-engagement");
    return data;
  },

  async getEventAttendance(): Promise<ApiSuccess<EventAttendancePoint[]>> {
    const { data } = await adminApiClient.get<ApiSuccess<EventAttendancePoint[]>>("/admin/analytics/event-attendance");
    return data;
  },
};
