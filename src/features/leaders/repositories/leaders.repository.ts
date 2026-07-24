import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { Leader, LeaderRegion } from "@/features/leaders/types";
import { leadersMock } from "@/features/leaders/mocks/leaders.mock";

const SIMULATED_LATENCY_MS = 450;

export class LeaderNotFoundError extends Error {}

export interface LeadersQuery {
  region: LeaderRegion | "All";
  search: string;
  page: number;
  limit: number;
}

export const leadersRepository = {
  async getLeadersPage(query: LeadersQuery): Promise<ApiPaginated<Leader>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    const filtered = leadersMock.data.filter((leader) => {
      const matchesRegion = query.region === "All" || leader.region === query.region;
      const matchesSearch = !q || leader.name.toLowerCase().includes(q) || leader.location.toLowerCase().includes(q);
      return matchesRegion && matchesSearch;
    });

    const start = (query.page - 1) * query.limit;
    const items = filtered.slice(start, start + query.limit);
    const totalPages = Math.max(1, Math.ceil(filtered.length / query.limit));

    return {
      success: true,
      data: items,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalItems: filtered.length,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiPaginated<Leader>>("/leaders", { params: query });
    // return data;
  },

  async getLeaderById(id: string): Promise<ApiSuccess<Leader>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const match = leadersMock.data.find((l) => l.id === id);
    if (!match) throw new LeaderNotFoundError(`No leader found for id ${id}`);
    return { success: true, message: "Leader retrieved successfully", data: match };
  },
};
