import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type {
  CommunityStats,
  FlaggedPost,
  PinnedAnnouncementItem,
  CommunityPostSummary,
  CommunityGroupSummary,
  CommunityPostDetail,
} from "@/features/admin-community/types";

export interface AdminPostsQuery {
  search: string;
  page: number;
  limit: number;
}

export const adminCommunityRepository = {
  async getStats(): Promise<ApiSuccess<CommunityStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<CommunityStats>>("/admin/community/stats");
    return data;
  },

  async getFlaggedPosts(): Promise<ApiSuccess<FlaggedPost[]>> {
    const { data } = await adminApiClient.get<ApiSuccess<FlaggedPost[]>>("/admin/community/flagged");
    return data;
  },

  async getPinnedAnnouncements(): Promise<ApiSuccess<PinnedAnnouncementItem[]>> {
    const { data } = await adminApiClient.get<ApiSuccess<PinnedAnnouncementItem[]>>("/admin/community/pinned");
    return data;
  },

  async getAllPosts(query: AdminPostsQuery): Promise<ApiPaginated<CommunityPostSummary>> {
    const { data } = await adminApiClient.get<ApiPaginated<CommunityPostSummary>>("/admin/community/posts", {
      params: { search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return data;
  },

  async getPostDetail(id: string): Promise<ApiSuccess<CommunityPostDetail>> {
    const { data } = await adminApiClient.get<ApiSuccess<CommunityPostDetail>>(`/admin/community/posts/${id}`);
    return data;
  },

  async getGroups(): Promise<ApiSuccess<CommunityGroupSummary[]>> {
    const { data } = await adminApiClient.get<ApiSuccess<CommunityGroupSummary[]>>("/admin/community/groups");
    return data;
  },

  async togglePin(id: string): Promise<ApiSuccess<{ pinned: boolean }>> {
    const { data } = await adminApiClient.post<ApiSuccess<{ pinned: boolean }>>(`/admin/community/posts/${id}/pin`, {});
    return data;
  },

  async approvePost(id: string): Promise<ApiSuccess<{ approved: boolean }>> {
    const { data } = await adminApiClient.post<ApiSuccess<{ approved: boolean }>>(`/admin/community/flagged/${id}/approve`, {});
    return data;
  },

  async removePost(id: string): Promise<ApiSuccess<{ removed: boolean }>> {
    const { data } = await adminApiClient.post<ApiSuccess<{ removed: boolean }>>(`/admin/community/flagged/${id}/remove`, {});
    return data;
  },

  async createPinnedAnnouncement(title: string, body: string): Promise<ApiSuccess<PinnedAnnouncementItem>> {
    const { data } = await adminApiClient.post<ApiSuccess<PinnedAnnouncementItem>>("/admin/community/pinned", { title, body });
    return data;
  },

  async unpinAnnouncement(id: string): Promise<ApiSuccess<{ unpinned: boolean }>> {
    const { data } = await adminApiClient.delete<ApiSuccess<{ unpinned: boolean }>>(`/admin/community/pinned/${id}`);
    return data;
  },
};
