import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminMembersService } from "@/features/admin-members/services/admin-members.service";
import type { MembershipTier } from "@/features/session/types";

export function useAdminMembersStats() {
  return useQuery({
    queryKey: ["admin", "members", "stats"],
    queryFn: adminMembersService.getStats,
  });
}

export function useAdminMembersPage(tier: MembershipTier | "All", search: string, page: number) {
  return useQuery({
    queryKey: ["admin", "members", "list", tier, search, page],
    queryFn: () => adminMembersService.getMembersPage({ tier, search, page, limit: 6 }),
    placeholderData: keepPreviousData,
  });
}

export function useAdminMember(id: string) {
  return useQuery({
    queryKey: ["admin", "members", "detail", id],
    queryFn: () => adminMembersService.getMemberById(id),
    enabled: Boolean(id),
  });
}

function useInvalidateMembers() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "members"] });
  };
}

export function useChangeTier() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ id, tier }: { id: string; tier: MembershipTier }) => adminMembersService.changeTier(id, tier),
    onSuccess: invalidate,
  });
}

export function useSetPaused() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ id, paused }: { id: string; paused: boolean }) => adminMembersService.setPaused(id, paused),
    onSuccess: invalidate,
  });
}

export function useResendWelcomeEmail() {
  return useMutation({
    mutationFn: (id: string) => adminMembersService.resendWelcomeEmail(id),
  });
}

export function useDeactivateAccount() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: (id: string) => adminMembersService.deactivateAccount(id),
    onSuccess: invalidate,
  });
}

export function useDeleteMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: (id: string) => adminMembersService.deleteMember(id),
    onSuccess: invalidate,
  });
}
