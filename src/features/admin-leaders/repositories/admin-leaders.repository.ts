import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminLeader, AdminLeaderRegion, AdminLeadersStats } from "@/features/admin-leaders/types";
import { adminLeadersStatsMock, adminLeadersMock } from "@/features/admin-leaders/mocks/admin-leaders.mock";

const SIMULATED_LATENCY_MS = 500;
const leadersStore: AdminLeader[] = [...adminLeadersMock];

export class AdminLeaderNotFoundError extends Error {}

export interface AdminLeadersQuery {
  region: AdminLeaderRegion | "All";
  search: string;
  page: number;
  limit: number;
}

export const adminLeadersRepository = {
  async getStats(): Promise<ApiSuccess<AdminLeadersStats>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return adminLeadersStatsMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AdminLeadersStats>>("/admin/leaders/stats");
    // return data;
  },

  async getLeadersPage(query: AdminLeadersQuery): Promise<ApiPaginated<AdminLeader>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    const filtered = leadersStore.filter((l) => {
      const matchesRegion = query.region === "All" || l.region === query.region;
      const matchesSearch = !q || l.fullName.toLowerCase().includes(q) || l.specialty.toLowerCase().includes(q);
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
    // const { data } = await apiClient.get<ApiPaginated<AdminLeader>>("/admin/leaders", { params: query });
    // return data;
  },

  async getLeaderById(id: string): Promise<ApiSuccess<AdminLeader>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const match = leadersStore.find((l) => l.id === id);
    if (!match) throw new AdminLeaderNotFoundError(`No leader found for id ${id}`);
    return { success: true, message: "Leader retrieved successfully", data: match };
  },

  async saveLeader(input: AdminLeader): Promise<ApiSuccess<AdminLeader>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const index = leadersStore.findIndex((l) => l.id === input.id);
    if (index >= 0) {
      leadersStore[index] = input;
    } else {
      leadersStore.unshift(input);
    }
    return { success: true, message: "Leader saved successfully", data: input };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.put<ApiSuccess<AdminLeader>>(`/admin/leaders/${input.id}`, input);
    // return data;
  },

  async deleteLeader(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = leadersStore.findIndex((l) => l.id === id);
    if (index === -1) throw new AdminLeaderNotFoundError(`No leader found for id ${id}`);
    leadersStore.splice(index, 1);
    return { success: true, message: "Leader deleted", data: { deleted: true } };
  },
};
