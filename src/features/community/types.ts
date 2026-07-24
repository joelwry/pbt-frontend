export interface PinnedAnnouncement {
  id: string;
  badgeLabel: string;
  title: string;
  body: string;
  postedByLabel: string;
  ctaLabel: string;
  ctaHref: string;
}

export type AuthorRoleTag = "PBT Leader" | "Power Team" | "PBT Plus" | "PBT Mentorship" | null;

export interface Reply {
  id: string;
  authorName: string;
  authorInitials: string;
  roleTag: AuthorRoleTag;
  message: string;
  postedAtLabel: string;
}

export interface Discussion {
  id: string;
  authorName: string;
  authorInitials: string;
  roleTag: AuthorRoleTag;
  pinned: boolean;
  title: string;
  excerpt: string;
  fullBody: string;
  replyCount: number;
  likeCount: number;
  likedByMe: boolean;
  postedAtLabel: string;
  replies: Reply[];
}

export interface LeaderSpotlight {
  name: string;
  initials: string;
  groupLabel: string;
  badgeLabel: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  membership: "Member" | "Join";
}

export interface CommunityMeta {
  pinnedAnnouncement: PinnedAnnouncement | null;
  leaderSpotlight: LeaderSpotlight | null;
  groups: CommunityGroup[];
  guidelinesUrl: string;
}

