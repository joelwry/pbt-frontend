import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminPartner, AdminPartnerCategory, AdminPowerTeamStats } from "@/features/admin-power-team/types";
import { adminPowerTeamStatsMock, adminPartnersMock } from "@/features/admin-power-team/mocks/admin-power-team.mock";

const SIMULATED_LATENCY_MS = 500;
const partnersStore: AdminPartner[] = [...adminPartnersMock];

export class AdminPartnerNotFoundError extends Error {}

export interface AdminPartnersQuery {
  category: AdminPartnerCategory | "All";
  search: string;
  page: number;
  limit: number;
}

export const adminPowerTeamRepository = {
  async getStats(): Promise<ApiSuccess<AdminPowerTeamStats>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return adminPowerTeamStatsMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AdminPowerTeamStats>>("/admin/power-team/stats");
    // return data;
  },

  async getPartnersPage(query: AdminPartnersQuery): Promise<ApiPaginated<AdminPartner>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    const filtered = partnersStore.filter((p) => {
      const matchesCategory = query.category === "All" || p.category === query.category;
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
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
    // const { data } = await apiClient.get<ApiPaginated<AdminPartner>>("/admin/power-team", { params: query });
    // return data;
  },

  async getPartnerById(id: string): Promise<ApiSuccess<AdminPartner>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const match = partnersStore.find((p) => p.id === id);
    if (!match) throw new AdminPartnerNotFoundError(`No partner found for id ${id}`);
    return { success: true, message: "Partner retrieved successfully", data: match };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AdminPartner>>(`/admin/power-team/${id}`);
    // return data;
  },

  async savePartner(input: AdminPartner): Promise<ApiSuccess<AdminPartner>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const index = partnersStore.findIndex((p) => p.id === input.id);
    if (index >= 0) {
      partnersStore[index] = input;
    } else {
      partnersStore.unshift(input);
    }
    return { success: true, message: "Partner saved successfully", data: input };
  },

  async deletePartner(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = partnersStore.findIndex((p) => p.id === id);
    if (index === -1) throw new AdminPartnerNotFoundError(`No partner found for id ${id}`);
    partnersStore.splice(index, 1);
    return { success: true, message: "Partner deleted", data: { deleted: true } };
  },
};
