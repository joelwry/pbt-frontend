import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminAccount, AdminUsersStats } from "@/features/admin-users/types";
import type { AdminRole } from "@/features/admin-auth/types";
import { adminUsersStatsMock, adminAccountsMock } from "@/features/admin-users/mocks/admin-users.mock";

const SIMULATED_LATENCY_MS = 500;
const adminAccountsStore: AdminAccount[] = [...adminAccountsMock];

export class AdminAccountNotFoundError extends Error {}

export interface AdminAccountsQuery {
  role: AdminRole | "All";
  search: string;
  page: number;
  limit: number;
}

export const adminUsersRepository = {
  async getStats(): Promise<ApiSuccess<AdminUsersStats>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    return adminUsersStatsMock;

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.get<ApiSuccess<AdminUsersStats>>("/admin/admin-users/stats");
    // return data;
  },

  async getAccountsPage(query: AdminAccountsQuery): Promise<ApiPaginated<AdminAccount>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));

    const q = query.search.trim().toLowerCase();
    const filtered = adminAccountsStore.filter((a) => {
      const matchesRole = query.role === "All" || a.role === query.role;
      const matchesSearch = !q || a.fullName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
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
    // const { data } = await apiClient.get<ApiPaginated<AdminAccount>>("/admin/admin-users", { params: query });
    // return data;
  },

  async getAccountById(id: string): Promise<ApiSuccess<AdminAccount>> {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const match = adminAccountsStore.find((a) => a.id === id);
    if (!match) throw new AdminAccountNotFoundError(`No admin account found for id ${id}`);
    return { success: true, message: "Admin account retrieved successfully", data: match };
  },

  async saveAccount(input: AdminAccount): Promise<ApiSuccess<AdminAccount>> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const index = adminAccountsStore.findIndex((a) => a.id === input.id);
    if (index >= 0) {
      adminAccountsStore[index] = input;
    } else {
      adminAccountsStore.unshift(input);
    }
    return { success: true, message: "Admin account saved successfully", data: input };

    // Live implementation, once the Express API exists:
    // const { data } = await apiClient.put<ApiSuccess<AdminAccount>>(`/admin/admin-users/${input.id}`, input);
    // return data;
  },

  async deleteAccount(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = adminAccountsStore.findIndex((a) => a.id === id);
    if (index === -1) throw new AdminAccountNotFoundError(`No admin account found for id ${id}`);
    adminAccountsStore.splice(index, 1);
    return { success: true, message: "Admin account removed", data: { deleted: true } };
  },
};
