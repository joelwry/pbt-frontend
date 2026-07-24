import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { MentorshipPageData, MentorshipCall } from "@/features/mentorship/types";
import { mentorshipPageMock, mentorshipCallsMock } from "@/features/mentorship/mocks/mentorship.mock";

const SIMULATED_LATENCY_MS = 400;
const callsStore: MentorshipCall[] = [...mentorshipCallsMock];

export const mentorshipRepository = {
  async getMentorshipPage(): Promise<ApiSuccess<MentorshipPageData>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return mentorshipPageMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<MentorshipPageData>>("/membership/mentorship");
    // return data;
  },

  async getCallsPage(page: number, limit: number): Promise<ApiPaginated<MentorshipCall>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const sorted = [...callsStore].sort((a, b) => new Date(b.dateLabel).getTime() - new Date(a.dateLabel).getTime());
    const start = (page - 1) * limit;
    const items = sorted.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(sorted.length / limit));

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        totalItems: sorted.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiPaginated<MentorshipCall>>("/membership/mentorship/calls", { params: { page, limit } });
    // return data;
  },

  async bookCall(input: { topic: string; dateLabel: string; mentorName: string }): Promise<ApiSuccess<MentorshipCall>> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const call: MentorshipCall = {
      id: `call_${Date.now()}`,
      dateLabel: input.dateLabel,
      topic: input.topic,
      mentorName: input.mentorName,
      status: "Scheduled",
    };
    callsStore.unshift(call);
    return { success: true, message: "Call booked successfully", data: call };
  },
};
