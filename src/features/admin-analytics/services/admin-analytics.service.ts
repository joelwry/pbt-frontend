import { adminAnalyticsRepository } from "@/features/admin-analytics/repositories/admin-analytics.repository";
import type {
  AnalyticsStats,
  MemberGrowthPoint,
  MembersByTier,
  ContentEngagementItem,
  EventAttendancePoint,
} from "@/features/admin-analytics/types";

export const adminAnalyticsService = {
  async getStats(): Promise<AnalyticsStats> {
    const response = await adminAnalyticsRepository.getStats();
    return response.data;
  },
  async getMemberGrowth(): Promise<MemberGrowthPoint[]> {
    const response = await adminAnalyticsRepository.getMemberGrowth();
    return response.data;
  },
  async getMembersByTier(): Promise<MembersByTier> {
    const response = await adminAnalyticsRepository.getMembersByTier();
    return response.data;
  },
  async getContentEngagement(): Promise<ContentEngagementItem[]> {
    const response = await adminAnalyticsRepository.getContentEngagement();
    return response.data;
  },
  async getEventAttendance(): Promise<EventAttendancePoint[]> {
    const response = await adminAnalyticsRepository.getEventAttendance();
    return response.data;
  },
};
