import type { MembershipTier } from "@/features/session/types";

export type AdminMemberStatus = "Active" | "Payment Failed" | "Paused";

export interface AdminMemberListItem {
  id: string;
  clientId: string;
  fullName: string;
  initials: string;
  email: string;
  tier: MembershipTier;
  joinedLabel: string;
  status: AdminMemberStatus;
  contractLabel: string;
}

export interface ActivityLogItem {
  id: string;
  icon: "lesson" | "community" | "event";
  description: string;
  timeAgoLabel: string;
}

export interface AdminMemberDetail extends AdminMemberListItem {
  phone: string;
  location: string;
  assignedLeader: string;
  assignedLeaderId: string | null;
  renewalDateLabel: string;
  paymentMethodLabel: string;
  memberSinceLabel: string;
  contractTypeLabel: string;
  lessonsCompleted: number;
  studyHours: number;
  recentActivity: ActivityLogItem[];
}

export interface AdminMembersStats {
  totalMembers: number;
  totalMembersDeltaLabel: string;
  newMembersThisWeek: number;
  failedPayments: number;
  pausedAccounts: number;
}

export interface MemberBillingRow {
  id: string;
  label: string;
  dateLabel: string;
  amount: number;
  status: "Paid";
}

export interface MemberLearningProgress {
  completedLessonsCount: number;
  completedModulesCount: number;
  overallProgress: number;
  totalLearningMinutes: number;
  streakDays: number;
}
