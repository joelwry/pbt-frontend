import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { adminCommunityService } from "@/features/admin-community/services/admin-community.service";

export function useCommunityStats() {
  return useQuery({ queryKey: ["admin", "community", "stats"], queryFn: adminCommunityService.getStats });
}

export function useFlaggedPosts() {
  return useQuery({ queryKey: ["admin", "community", "flagged"], queryFn: adminCommunityService.getFlaggedPosts });
}

export function usePinnedAnnouncements() {
  return useQuery({ queryKey: ["admin", "community", "pinned"], queryFn: adminCommunityService.getPinnedAnnouncements });
}

export function useAllPosts(search: string, page: number) {
  return useQuery({
    queryKey: ["admin", "community", "all-posts", search, page],
    queryFn: () => adminCommunityService.getAllPosts({ search, page, limit: 6 }),
    placeholderData: keepPreviousData,
  });
}

export function usePostDetail(id: string) {
  return useQuery({
    queryKey: ["admin", "community", "post", id],
    queryFn: () => adminCommunityService.getPostDetail(id),
  });
}

export function useCommunityGroups() {
  return useQuery({ queryKey: ["admin", "community", "groups"], queryFn: adminCommunityService.getGroups });
}

function useInvalidateCommunity() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["admin", "community"] });
}

export function useTogglePin() {
  const invalidate = useInvalidateCommunity();
  return useMutation({ mutationFn: (id: string) => adminCommunityService.togglePin(id), onSuccess: invalidate });
}

export function useApprovePost() {
  const invalidate = useInvalidateCommunity();
  return useMutation({ mutationFn: (id: string) => adminCommunityService.approvePost(id), onSuccess: invalidate });
}

export function useRemovePost() {
  const invalidate = useInvalidateCommunity();
  return useMutation({ mutationFn: (id: string) => adminCommunityService.removePost(id), onSuccess: invalidate });
}

export function useCreatePinnedAnnouncement() {
  const invalidate = useInvalidateCommunity();
  return useMutation({
    mutationFn: ({ title, body }: { title: string; body: string }) => adminCommunityService.createPinnedAnnouncement(title, body),
    onSuccess: invalidate,
  });
}

export function useUnpinAnnouncement() {
  const invalidate = useInvalidateCommunity();
  return useMutation({ mutationFn: (id: string) => adminCommunityService.unpinAnnouncement(id), onSuccess: invalidate });
}
