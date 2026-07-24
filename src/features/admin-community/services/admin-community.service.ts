import { adminCommunityRepository } from "@/features/admin-community/repositories/admin-community.repository";
import type {
  CommunityStats,
  FlaggedPost,
  PinnedAnnouncementItem,
  CommunityPostSummary,
  CommunityGroupSummary,
} from "@/features/admin-community/types";

export const adminCommunityService = {
  async getStats(): Promise<CommunityStats> {
    const response = await adminCommunityRepository.getStats();
    return response.data;
  },
  async getFlaggedPosts(): Promise<FlaggedPost[]> {
    const response = await adminCommunityRepository.getFlaggedPosts();
    return response.data;
  },
  async getPinnedAnnouncements(): Promise<PinnedAnnouncementItem[]> {
    const response = await adminCommunityRepository.getPinnedAnnouncements();
    return response.data;
  },
  async getAllPosts(): Promise<CommunityPostSummary[]> {
    const response = await adminCommunityRepository.getAllPosts();
    return response.data;
  },
  async getGroups(): Promise<CommunityGroupSummary[]> {
    const response = await adminCommunityRepository.getGroups();
    return response.data;
  },
  async approvePost(id: string): Promise<boolean> {
    const response = await adminCommunityRepository.approvePost(id);
    return response.data.approved;
  },
  async removePost(id: string): Promise<boolean> {
    const response = await adminCommunityRepository.removePost(id);
    return response.data.removed;
  },
  async createPinnedAnnouncement(title: string): Promise<PinnedAnnouncementItem> {
    const response = await adminCommunityRepository.createPinnedAnnouncement(title);
    return response.data;
  },
  async unpinAnnouncement(id: string): Promise<boolean> {
    const response = await adminCommunityRepository.unpinAnnouncement(id);
    return response.data.unpinned;
  },
};
