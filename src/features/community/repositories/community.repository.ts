import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { CommunityMeta, Discussion } from "@/features/community/types";
import { communityMetaMock, discussionsMock } from "@/features/community/mocks/community.mock";

const SIMULATED_LATENCY_MS = 500;

// Mutable in-memory store so create/like mutations persist for the session.
const discussionsStore: Discussion[] = [...discussionsMock];

export class CommunityNotFoundError extends Error {}

export const communityRepository = {
  async getMeta(): Promise<ApiSuccess<CommunityMeta>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return communityMetaMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<CommunityMeta>>("/community/meta");
    // return data;
  },

  async getDiscussionsPage(page: number, limit: number): Promise<ApiPaginated<Discussion>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const start = (page - 1) * limit;
    const items = discussionsStore.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(discussionsStore.length / limit));

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        totalItems: discussionsStore.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiPaginated<Discussion>>("/community/discussions", { params: { page, limit } });
    // return data;
  },

  async getDiscussionById(id: string): Promise<ApiSuccess<Discussion>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const match = discussionsStore.find((d) => d.id === id);
    if (!match) throw new CommunityNotFoundError(`No discussion found for id ${id}`);
    return { success: true, message: "Discussion retrieved successfully", data: match };
  },

  async createDiscussion(input: { title: string; excerpt: string; authorName: string; authorInitials: string }): Promise<ApiSuccess<Discussion>> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const discussion: Discussion = {
      id: `disc_${Date.now()}`,
      authorName: input.authorName,
      authorInitials: input.authorInitials,
      roleTag: null,
      pinned: false,
      title: input.title,
      excerpt: input.excerpt,
      fullBody: input.excerpt,
      replyCount: 0,
      likeCount: 0,
      likedByMe: false,
      postedAtLabel: "Just now",
      replies: [],
    };
    discussionsStore.unshift(discussion);
    return { success: true, message: "Discussion created successfully", data: discussion };
  },

  async toggleLike(discussionId: string): Promise<ApiSuccess<Discussion>> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const discussion = discussionsStore.find((d) => d.id === discussionId);
    if (!discussion) throw new CommunityNotFoundError(`No discussion found for id ${discussionId}`);
    discussion.likedByMe = !discussion.likedByMe;
    discussion.likeCount += discussion.likedByMe ? 1 : -1;
    return { success: true, message: "Updated", data: discussion };
  },

  async addReply(discussionId: string, input: { authorName: string; authorInitials: string; message: string }): Promise<ApiSuccess<Discussion>> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const discussion = discussionsStore.find((d) => d.id === discussionId);
    if (!discussion) throw new CommunityNotFoundError(`No discussion found for id ${discussionId}`);
    discussion.replies.push({
      id: `rep_${Date.now()}`,
      authorName: input.authorName,
      authorInitials: input.authorInitials,
      roleTag: null,
      message: input.message,
      postedAtLabel: "Just now",
    });
    discussion.replyCount += 1;
    return { success: true, message: "Reply added successfully", data: discussion };
  },
};
