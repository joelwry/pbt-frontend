import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminUsersService } from "@/features/admin-users/services/admin-users.service";
import type { AdminAccount } from "@/features/admin-users/types";
import type { AdminRole } from "@/features/admin-auth/types";

export function useAdminUsersStats() {
  return useQuery({ queryKey: ["admin", "admin-users", "stats"], queryFn: adminUsersService.getStats });
}

export function useAdminAccountsPage(role: AdminRole | "All", search: string, page: number) {
  return useQuery({
    queryKey: ["admin", "admin-users", "list", role, search, page],
    queryFn: () => adminUsersService.getAccountsPage({ role, search, page, limit: 4 }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminAccount(id: string) {
  return useQuery({
    queryKey: ["admin", "admin-users", "detail", id],
    queryFn: () => adminUsersService.getAccountById(id),
    enabled: Boolean(id) && id !== "new",
  });
}

function useInvalidateAdminAccounts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["admin", "admin-users"] });
}

export function useSaveAdminAccount() {
  const invalidate = useInvalidateAdminAccounts();
  return useMutation({
    mutationFn: ({ account, useRoleDefaults }: { account: AdminAccount; useRoleDefaults: boolean }) =>
      adminUsersService.saveAccount(account, { useRoleDefaults }),
    onSuccess: invalidate,
  });
}

export function useDeleteAdminAccount() {
  const invalidate = useInvalidateAdminAccounts();
  return useMutation({ mutationFn: (id: string) => adminUsersService.deleteAccount(id), onSuccess: invalidate });
}
