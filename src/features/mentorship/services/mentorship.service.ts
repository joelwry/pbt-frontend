import { mentorshipRepository } from "@/features/mentorship/repositories/mentorship.repository";
import type { MentorshipPageData, MentorshipCall } from "@/features/mentorship/types";
import type { Pagination } from "@/types/api";

export interface CallsPage {
  items: MentorshipCall[];
  pagination: Pagination;
}

export const mentorshipService = {
  async getMentorshipPage(): Promise<MentorshipPageData> {
    const response = await mentorshipRepository.getMentorshipPage();
    return response.data;
  },

  async getCallsPage(page: number, limit: number): Promise<CallsPage> {
    const response = await mentorshipRepository.getCallsPage(page, limit);
    return { items: response.data, pagination: response.pagination };
  },

  async bookCall(input: { topic: string; dateLabel: string; mentorName: string }): Promise<MentorshipCall> {
    const response = await mentorshipRepository.bookCall(input);
    return response.data;
  },
};
