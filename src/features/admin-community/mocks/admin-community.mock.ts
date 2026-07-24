import type { ApiSuccess } from "@/types/api";
import type {
  CommunityStats,
  FlaggedPost,
  PinnedAnnouncementItem,
  CommunityPostSummary,
  CommunityGroupSummary,
} from "@/features/admin-community/types";

export const communityStatsMock: ApiSuccess<CommunityStats> = {
  success: true,
  message: "Community stats retrieved successfully",
  data: { totalPosts: 346, totalPostsMonthLabel: "This month", flaggedCount: 2, pinnedCount: 3, groupsCount: 6 },
};

export const flaggedPostsMock: FlaggedPost[] = [
  {
    id: "flag_1",
    postTitle: "\"Best BRRR strategies for 2026\" — whats working right now",
    quote: "This lender is a scam, avoid them at all costs and use my referral link instead...",
    reportedByCount: 4,
    reason: "Suspected spam / external promotion",
    postedByName: "Unverified Member",
    timeAgoLabel: "3 hours ago",
  },
  {
    id: "flag_2",
    postTitle: "HMO licensing changes — what you need to know",
    quote: "That's completely wrong information and could get people in serious legal trouble...",
    reportedByCount: 2,
    reason: "Reported as misleading / inaccurate",
    postedByName: "Kemi Osei",
    timeAgoLabel: "6 hours ago",
  },
];

export const pinnedAnnouncementsMock: PinnedAnnouncementItem[] = [
  { id: "pin_1", title: "2026 Q3 Deal Sourcing Toolkit is now live", pinnedTimeLabel: "Pinned 2 hours ago" },
  { id: "pin_2", title: "Platform maintenance — Sunday 26 Jul, 2–4 AM GMT", pinnedTimeLabel: "Pinned 1 day ago" },
  { id: "pin_3", title: "Welcome to our newest PBT Leaders!", pinnedTimeLabel: "Pinned 4 days ago" },
];

export const communityPostsMock: CommunityPostSummary[] = [
  { id: "disc_1", title: "\"Best BRRR strategies for 2026\" — whats working right now", authorName: "Michael Adeyemi", replyCount: 34, likeCount: 112, postedAtLabel: "3h ago" },
  { id: "disc_2", title: "HMO licensing changes — what you need to know", authorName: "Sarah Bello", replyCount: 21, likeCount: 76, postedAtLabel: "5h ago" },
  { id: "disc_3", title: "Refinancing in a high-rate market", authorName: "Tunde Grant", replyCount: 18, likeCount: 54, postedAtLabel: "7h ago" },
  { id: "disc_4", title: "First HMO — sourcing tips for beginners", authorName: "Kemi Osei", replyCount: 12, likeCount: 41, postedAtLabel: "9h ago" },
  { id: "disc_5", title: "Article 4 areas in Yorkshire — updated map", authorName: "Ravinder Kaur", replyCount: 6, likeCount: 29, postedAtLabel: "11h ago" },
  { id: "disc_6", title: "Insurance premiums rising for HMOs — what we're seeing", authorName: "Laura Chapman", replyCount: 5, likeCount: 33, postedAtLabel: "1d ago" },
];

export const communityGroupsMock: CommunityGroupSummary[] = [
  { id: "grp_midlands", name: "Midlands Investors", memberCount: 184, status: "Active" },
  { id: "grp_mentorship_circle", name: "PBT Mentorship Circle", memberCount: 96, status: "Active" },
  { id: "grp_first_time_hmo", name: "First-Time HMO Owners", memberCount: 221, status: "Active" },
  { id: "grp_north_west", name: "North West Group", memberCount: 143, status: "Active" },
  { id: "grp_deal_analysis", name: "Deal Analysis Circle", memberCount: 67, status: "Active" },
  { id: "grp_legacy_2023", name: "2023 Cohort (Legacy)", memberCount: 38, status: "Archived" },
];
