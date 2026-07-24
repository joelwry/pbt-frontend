import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useAllPosts() {
  return useQuery({ queryKey: ["admin", "community", "all-posts"], queryFn: adminCommunityService.getAllPosts });
}

export function useCommunityGroups() {
  return useQuery({ queryKey: ["admin", "community", "groups"], queryFn: adminCommunityService.getGroups });
}

function useInvalidateCommunity() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["admin", "community"] });
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
  return useMutation({ mutationFn: (title: string) => adminCommunityService.createPinnedAnnouncement(title), onSuccess: invalidate });
}

export function useUnpinAnnouncement() {
  const invalidate = useInvalidateCommunity();
  return useMutation({ mutationFn: (id: string) => adminCommunityService.unpinAnnouncement(id), onSuccess: invalidate });
}
