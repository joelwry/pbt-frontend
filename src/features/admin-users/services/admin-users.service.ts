import { adminUsersRepository, type AdminAccountsQuery } from "@/features/admin-users/repositories/admin-users.repository";
import type { AdminAccount, AdminUsersStats } from "@/features/admin-users/types";
import type { Pagination } from "@/types/api";

export interface AdminAccountsPage {
  items: AdminAccount[];
  pagination: Pagination;
}

export const adminUsersService = {
  async getStats(): Promise<AdminUsersStats> {
    const response = await adminUsersRepository.getStats();
    return response.data;
  },
  async getAccountsPage(query: AdminAccountsQuery): Promise<AdminAccountsPage> {
    const response = await adminUsersRepository.getAccountsPage(query);
    return { items: response.data, pagination: response.pagination };
  },
  async getAccountById(id: string): Promise<AdminAccount> {
    const response = await adminUsersRepository.getAccountById(id);
    return response.data;
  },
  async saveAccount(input: AdminAccount, options?: { useRoleDefaults?: boolean }): Promise<AdminAccount> {
    const response = await adminUsersRepository.saveAccount(input, options);
    return response.data;
  },
  async deleteAccount(id: string): Promise<boolean> {
    const response = await adminUsersRepository.deleteAccount(id);
    return response.data.deleted;
  },
};
