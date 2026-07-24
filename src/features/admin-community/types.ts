export type CommunityTab = "All Posts" | "Pinned" | "Flagged" | "Groups";

export interface CommunityStats {
  totalPosts: number;
  totalPostsMonthLabel: string;
  flaggedCount: number;
  pinnedCount: number;
  groupsCount: number;
}

export interface FlaggedPost {
  id: string;
  postTitle: string;
  quote: string;
  reportedByCount: number;
  reason: string;
  postedByName: string;
  timeAgoLabel: string;
}

export interface PinnedAnnouncementItem {
  id: string;
  title: string;
  pinnedTimeLabel: string;
}

export interface CommunityPostSummary {
  id: string;
  title: string;
  authorName: string;
  replyCount: number;
  likeCount: number;
  postedAtLabel: string;
}

export interface CommunityGroupSummary {
  id: string;
  name: string;
  memberCount: number;
  status: "Active" | "Archived";
}
