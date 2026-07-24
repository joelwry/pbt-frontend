import type { MembershipTier } from "@/features/session/types";

export interface AdminDashboardStats {
  activeMembers: number;
  activeMembersDeltaLabel: string;
  mrrLabel: string;
  mrrDeltaLabel: string;
  lessonsPublished: number;
  lessonsPublishedYearLabel: string;
  lessonsUnlockThisWeekLabel: string;
  communityPosts: number;
  communityPostsTodayLabel: string;
}

export interface MembershipBreakdownSegment {
  tier: MembershipTier;
  label: string;
  percent: number;
}

export interface MembershipBreakdown {
  totalMembers: number;
  yearLabel: string;
  segments: MembershipBreakdownSegment[];
}

export interface AdminRecentMember {
  id: string;
  fullName: string;
  initials: string;
  email: string;
  tier: MembershipTier;
  joinedLabel: string;
  status: "Active" | "Payment Failed" | "Paused";
}

export type AttentionIcon = "flag" | "payment" | "event";

export interface AttentionItem {
  id: string;
  icon: AttentionIcon;
  title: string;
  subtitle: string;
  href: string;
}

export interface UpcomingUnlock {
  id: string;
  day: string;
  month: string;
  title: string;
  moduleLabel: string;
  badgeLabel: string;
}

export interface AdminDashboardData {
  adminFirstName: string;
  stats: AdminDashboardStats;
  membershipBreakdown: MembershipBreakdown;
  recentlyJoined: AdminRecentMember[];
  needsAttention: AttentionItem[];
  upcomingUnlocks: UpcomingUnlock[];
}
