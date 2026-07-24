import { communityRepository } from "@/features/community/repositories/community.repository";
import type { CommunityMeta, Discussion } from "@/features/community/types";
import type { Pagination } from "@/types/api";

export interface DiscussionsPage {
  items: Discussion[];
  pagination: Pagination;
}

export const communityService = {
  async getMeta(): Promise<CommunityMeta> {
    const response = await communityRepository.getMeta();
    return response.data;
  },

  async getDiscussionsPage(page: number, limit: number): Promise<DiscussionsPage> {
    const response = await communityRepository.getDiscussionsPage(page, limit);
    return { items: response.data, pagination: response.pagination };
  },

  async getDiscussionById(id: string): Promise<Discussion> {
    const response = await communityRepository.getDiscussionById(id);
    return response.data;
  },

  async createDiscussion(input: { title: string; excerpt: string; authorName: string; authorInitials: string }): Promise<Discussion> {
    const response = await communityRepository.createDiscussion(input);
    return response.data;
  },

  async toggleLike(discussionId: string): Promise<Discussion> {
    const response = await communityRepository.toggleLike(discussionId);
    return response.data;
  },

  async addReply(discussionId: string, input: { authorName: string; authorInitials: string; message: string }): Promise<Discussion> {
    const response = await communityRepository.addReply(discussionId, input);
    return response.data;
  },
};
