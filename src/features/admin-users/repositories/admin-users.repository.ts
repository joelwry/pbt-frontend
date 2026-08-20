import { adminApiClient } from "@/lib/admin-api-client";
import type { ApiSuccess, ApiPaginated } from "@/types/api";
import type { AdminAccount, AdminUsersStats } from "@/features/admin-users/types";
import type { AdminRole } from "@/features/admin-auth/types";

export class AdminAccountNotFoundError extends Error {}

export interface AdminAccountsQuery {
  role: AdminRole | "All";
  search: string;
  page: number;
  limit: number;
}

export const adminUsersRepository = {
  async getStats(): Promise<ApiSuccess<AdminUsersStats>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminUsersStats>>("/admin/admin-users/stats");
    return data;
  },

  async getAccountsPage(query: AdminAccountsQuery): Promise<ApiPaginated<AdminAccount>> {
    const { data } = await adminApiClient.get<ApiPaginated<AdminAccount>>("/admin/admin-users", {
      params: { role: query.role, search: query.search || undefined, page: query.page, limit: query.limit },
    });
    return data;
  },

  async getAccountById(id: string): Promise<ApiSuccess<AdminAccount>> {
    const { data } = await adminApiClient.get<ApiSuccess<AdminAccount>>(`/admin/admin-users/${id}`);
    return data;
  },

  /**
   * New accounts carry a client-generated `au_<timestamp>` id (see
   * admin-user-editor-view.tsx) until the invite is sent -- that's the
   * signal to POST rather than PATCH.
   *
   * `useRoleDefaults` is why `sections` is sometimes absent rather than
   * empty: omitting it on create, or asking for a reset on update, leaves
   * the account inheriting its role's defaults. Sending `[]` instead would
   * tell the API the opposite -- a deliberate lockout.
   */
  async saveAccount(input: AdminAccount, options: { useRoleDefaults?: boolean } = {}): Promise<ApiSuccess<AdminAccount>> {
    if (input.id.startsWith("au_")) {
      const { data } = await adminApiClient.post<ApiSuccess<AdminAccount>>("/admin/admin-users", {
        fullName: input.fullName,
        email: input.email,
        role: input.role,
        ...(options.useRoleDefaults ? {} : { sections: input.sections }),
      });
      return data;
    }

    const { data } = await adminApiClient.patch<ApiSuccess<AdminAccount>>(`/admin/admin-users/${input.id}`, {
      fullName: input.fullName,
      role: input.role,
      ...(options.useRoleDefaults ? { resetSectionsToRoleDefaults: true } : { sections: input.sections }),
    });
    return data;
  },

  async deleteAccount(id: string): Promise<ApiSuccess<{ deleted: boolean }>> {
    const { data } = await adminApiClient.delete<ApiSuccess<{ deleted: boolean }>>(`/admin/admin-users/${id}`);
    return data;
  },
};
