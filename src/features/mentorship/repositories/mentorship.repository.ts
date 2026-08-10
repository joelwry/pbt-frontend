import { apiClient } from "@/lib/api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { MentorshipPageData, MentorshipCall } from "@/features/mentorship/types";

export const mentorshipRepository = {
  async getMentorshipPage(): Promise<ApiSuccess<MentorshipPageData>> {
    const { data } = await apiClient.get<ApiSuccess<MentorshipPageData>>("/membership/mentorship");
    return data;
  },

  async getCallsPage(page: number, limit: number): Promise<ApiPaginated<MentorshipCall>> {
    const { data } = await apiClient.get<ApiPaginated<MentorshipCall>>("/membership/mentorship/calls", { params: { page, limit } });
    return data;
  },

  async bookCall(input: { topic: string; scheduledAt: string }): Promise<ApiSuccess<MentorshipCall>> {
    const { data } = await apiClient.post<ApiSuccess<MentorshipCall>>("/membership/mentorship/calls", input);
    return data;
  },
};
