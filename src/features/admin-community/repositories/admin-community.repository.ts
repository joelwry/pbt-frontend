import type { ApiSuccess } from "@/types/api";
import type {
  CommunityStats,
  FlaggedPost,
  PinnedAnnouncementItem,
  CommunityPostSummary,
  CommunityGroupSummary,
} from "@/features/admin-community/types";
import {
  communityStatsMock,
  flaggedPostsMock,
  pinnedAnnouncementsMock,
  communityPostsMock,
  communityGroupsMock,
} from "@/features/admin-community/mocks/admin-community.mock";

const SIMULATED_LATENCY_MS = 500;
const flaggedStore: FlaggedPost[] = [...flaggedPostsMock];
const pinnedStore: PinnedAnnouncementItem[] = [...pinnedAnnouncementsMock];

export const adminCommunityRepository = {
  async getStats(): Promise<ApiSuccess<CommunityStats>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return { ...communityStatsMock, data: { ...communityStatsMock.data, flaggedCount: flaggedStore.length, pinnedCount: pinnedStore.length } };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<CommunityStats>>("/admin/community/stats");
    // return data;
  },

  async getFlaggedPosts(): Promise<ApiSuccess<FlaggedPost[]>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return { success: true, message: "Flagged posts retrieved successfully", data: flaggedStore };
  },

  async getPinnedAnnouncements(): Promise<ApiSuccess<PinnedAnnouncementItem[]>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return { success: true, message: "Pinned announcements retrieved successfully", data: pinnedStore };
  },

  async getAllPosts(): Promise<ApiSuccess<CommunityPostSummary[]>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return { success: true, message: "Posts retrieved successfully", data: communityPostsMock };
  },

  async getGroups(): Promise<ApiSuccess<CommunityGroupSummary[]>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return { success: true, message: "Groups retrieved successfully", data: communityGroupsMock };
  },

  async approvePost(id: string): Promise<ApiSuccess<{ approved: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = flaggedStore.findIndex((p) => p.id === id);
    if (index >= 0) flaggedStore.splice(index, 1);
    return { success: true, message: "Post approved", data: { approved: true } };
  },

  async removePost(id: string): Promise<ApiSuccess<{ removed: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = flaggedStore.findIndex((p) => p.id === id);
    if (index >= 0) flaggedStore.splice(index, 1);
    return { success: true, message: "Post removed", data: { removed: true } };
  },

  async createPinnedAnnouncement(title: string): Promise<ApiSuccess<PinnedAnnouncementItem>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const item: PinnedAnnouncementItem = { id: `pin_${Date.now()}`, title, pinnedTimeLabel: "Pinned just now" };
    pinnedStore.unshift(item);
    return { success: true, message: "Announcement pinned", data: item };
  },

  async unpinAnnouncement(id: string): Promise<ApiSuccess<{ unpinned: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const index = pinnedStore.findIndex((p) => p.id === id);
    if (index >= 0) pinnedStore.splice(index, 1);
    return { success: true, message: "Announcement unpinned", data: { unpinned: true } };
  },
};
