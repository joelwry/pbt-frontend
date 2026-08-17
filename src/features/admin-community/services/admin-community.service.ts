import { adminCommunityRepository, type AdminPostsQuery } from "@/features/admin-community/repositories/admin-community.repository";
import type {
  CommunityStats,
  FlaggedPost,
  PinnedAnnouncementItem,
  CommunityPostSummary,
  CommunityGroupSummary,
  CommunityPostDetail,
} from "@/features/admin-community/types";
import type { Pagination } from "@/types/api";

export interface AdminPostsPage {
  items: CommunityPostSummary[];
  pagination: Pagination;
}

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
  async getAllPosts(query: AdminPostsQuery): Promise<AdminPostsPage> {
    const response = await adminCommunityRepository.getAllPosts(query);
    return { items: response.data, pagination: response.pagination };
  },
  async getPostDetail(id: string): Promise<CommunityPostDetail> {
    const response = await adminCommunityRepository.getPostDetail(id);
    return response.data;
  },
  async getGroups(): Promise<CommunityGroupSummary[]> {
    const response = await adminCommunityRepository.getGroups();
    return response.data;
  },
  async togglePin(id: string): Promise<boolean> {
    const response = await adminCommunityRepository.togglePin(id);
    return response.data.pinned;
  },
  async approvePost(id: string): Promise<boolean> {
    const response = await adminCommunityRepository.approvePost(id);
    return response.data.approved;
  },
  async removePost(id: string): Promise<boolean> {
    const response = await adminCommunityRepository.removePost(id);
    return response.data.removed;
  },
  async createPinnedAnnouncement(title: string, body: string): Promise<PinnedAnnouncementItem> {
    const response = await adminCommunityRepository.createPinnedAnnouncement(title, body);
    return response.data;
  },
  async unpinAnnouncement(id: string): Promise<boolean> {
    const response = await adminCommunityRepository.unpinAnnouncement(id);
    return response.data.unpinned;
  },
};
