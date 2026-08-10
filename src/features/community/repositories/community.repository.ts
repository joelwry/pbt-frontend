import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { CommunityMeta, Discussion, Reply, AuthorRoleTag } from "@/features/community/types";

interface BackendReply {
  id: string;
  authorName: string;
  authorInitials: string;
  roleTag: AuthorRoleTag;
  message: string;
  postedAtLabel: string;
}

interface BackendDiscussion {
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
  replies: BackendReply[];
}

function toReply(r: BackendReply): Reply {
  return { ...r };
}

function toDiscussion(d: BackendDiscussion): Discussion {
  return { ...d, replies: d.replies.map(toReply) };
}

export const communityRepository = {
  async getMeta(): Promise<ApiSuccess<CommunityMeta>> {
    const { data } = await apiClient.get<ApiSuccess<CommunityMeta>>("/community/meta");
    return data;
  },

  async getDiscussionsPage(page: number, limit: number): Promise<ApiPaginated<Discussion>> {
    const { data } = await apiClient.get<ApiPaginated<BackendDiscussion>>("/community", { params: { page, limit } });
    return { success: true, data: data.data.map(toDiscussion), pagination: data.pagination };
  },

  async getDiscussionById(id: string): Promise<ApiSuccess<Discussion>> {
    const { data } = await apiClient.get<ApiSuccess<BackendDiscussion>>(`/community/${id}`);
    return { success: true, message: data.message, data: toDiscussion(data.data) };
  },

  async createDiscussion(input: { title: string; excerpt: string }): Promise<ApiSuccess<Discussion>> {
    const { data } = await apiClient.post<ApiSuccess<BackendDiscussion>>("/community", {
      title: input.title,
      content: input.excerpt,
    });
    return { success: true, message: data.message, data: toDiscussion(data.data) };
  },

  async toggleLike(discussionId: string): Promise<ApiSuccess<Discussion>> {
    const { data } = await apiClient.post<ApiSuccess<BackendDiscussion>>(`/community/${discussionId}/like`, {});
    return { success: true, message: data.message, data: toDiscussion(data.data) };
  },

  async addReply(discussionId: string, input: { message: string }): Promise<ApiSuccess<Discussion>> {
    const { data } = await apiClient.post<ApiSuccess<BackendDiscussion>>(`/community/${discussionId}/replies`, {
      content: input.message,
    });
    return { success: true, message: data.message, data: toDiscussion(data.data) };
  },

  async reportDiscussion(discussionId: string, reason: string): Promise<void> {
    await apiClient.post(`/community/${discussionId}/report`, { reason });
  },
};
