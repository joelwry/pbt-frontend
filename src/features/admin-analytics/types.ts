import type { MembershipTier } from "@/features/session/types";

export interface AnalyticsStats {
  activeMembers: number;
  activeMembersDeltaLabel: string;
  contentCompletionPercent: number;
  eventAttendancePercent: number;
  membershipGrowthPercent: number;
}

export interface MemberGrowthPoint {
  monthLabel: string;
  newMembers: number;
}

export interface MembersByTierSegment {
  tier: MembershipTier;
  percent: number;
}

export interface MembersByTier {
  totalMembers: number;
  segments: MembersByTierSegment[];
}

export interface ContentEngagementItem {
  title: string;
  completionPercent: number;
}

export interface EventAttendancePoint {
  eventLabel: string;
  attendeeCount: number;
}
