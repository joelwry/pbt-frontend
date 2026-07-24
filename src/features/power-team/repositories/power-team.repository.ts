import type { ApiPaginated } from "@/types/api";
import type { Partner, PartnerCategory } from "@/features/power-team/types";
import { partnersMock } from "@/features/power-team/mocks/power-team.mock";

const SIMULATED_LATENCY_MS = 450;

export interface PartnersQuery {
  category: PartnerCategory | "All";
  search: string;
  page: number;
  limit: number;
}

export const powerTeamRepository = {
  async getPartnersPage(query: PartnersQuery): Promise<ApiPaginated<Partner>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    const filtered = partnersMock.data.filter((partner) => {
      const matchesCategory = query.category === "All" || partner.category === query.category;
      const matchesSearch = !q || partner.name.toLowerCase().includes(q) || partner.city.toLowerCase().includes(q);
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
    // const { data } = await apiClient.get<ApiPaginated<Partner>>("/power-team", { params: query });
    // return data;
  },
};
