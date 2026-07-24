import { useQuery } from "@tanstack/react-query";
import { adminAnalyticsService } from "@/features/admin-analytics/services/admin-analytics.service";

export function useAnalyticsStats() {
  return useQuery({ queryKey: ["admin", "analytics", "stats"], queryFn: adminAnalyticsService.getStats });
}

export function useMemberGrowth() {
  return useQuery({ queryKey: ["admin", "analytics", "member-growth"], queryFn: adminAnalyticsService.getMemberGrowth });
}

export function useMembersByTier() {
  return useQuery({ queryKey: ["admin", "analytics", "members-by-tier"], queryFn: adminAnalyticsService.getMembersByTier });
}

export function useContentEngagement() {
  return useQuery({ queryKey: ["admin", "analytics", "content-engagement"], queryFn: adminAnalyticsService.getContentEngagement });
}

export function useEventAttendance() {
  return useQuery({ queryKey: ["admin", "analytics", "event-attendance"], queryFn: adminAnalyticsService.getEventAttendance });
}
