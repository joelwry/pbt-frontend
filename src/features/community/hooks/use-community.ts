import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { communityService } from "@/features/community/services/community.service";
import type { Discussion } from "@/features/community/types";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";

const DISCUSSIONS_PAGE_SIZE = 4;
const DISCUSSIONS_KEY = ["community", "discussions"];

export function useCommunityMeta() {
  return useQuery({
    queryKey: ["community", "meta"],
    queryFn: communityService.getMeta,
  });
}

/** Load More feed — accumulates pages rather than replacing them, unlike Pagination. */
export function useDiscussionsFeed() {
  return useInfiniteQuery({
    queryKey: DISCUSSIONS_KEY,
    queryFn: ({ pageParam }) => communityService.getDiscussionsPage(pageParam, DISCUSSIONS_PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined),
  });
}

export function useDiscussion(discussionId: string) {
  return useQuery({
    queryKey: ["community", "discussion", discussionId],
    queryFn: () => communityService.getDiscussionById(discussionId),
    enabled: Boolean(discussionId),
  });
}

export function useCreateDiscussion() {
  const queryClient = useQueryClient();
  const { data: member } = useCurrentMember();

  return useMutation({
    mutationFn: (input: { title: string; excerpt: string }) =>
      communityService.createDiscussion({
        ...input,
        authorName: member?.fullName ?? "You",
        authorInitials: member?.initials ?? "Y",
      }),
    onSuccess: (newDiscussion) => {
      queryClient.setQueryData<{ pages: { items: Discussion[]; pagination: unknown }[]; pageParams: unknown[] }>(
        DISCUSSIONS_KEY,
        (prev) => {
          if (!prev) return prev;
          const pages = [...prev.pages];
          pages[0] = { ...pages[0], items: [newDiscussion, ...pages[0].items] };
          return { ...prev, pages };
        }
      );
    },
  });
}

export function useToggleLike(discussionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => communityService.toggleLike(discussionId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["community", "discussion", discussionId], updated);
      queryClient.setQueryData<{ pages: { items: Discussion[]; pagination: unknown }[]; pageParams: unknown[] }>(
        DISCUSSIONS_KEY,
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              items: page.items.map((d) => (d.id === updated.id ? updated : d)),
            })),
          };
        }
      );
    },
  });
}

export function useAddReply(discussionId: string) {
  const queryClient = useQueryClient();
  const { data: member } = useCurrentMember();

  return useMutation({
    mutationFn: (message: string) =>
      communityService.addReply(discussionId, {
        message,
        authorName: member?.fullName ?? "You",
        authorInitials: member?.initials ?? "Y",
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["community", "discussion", discussionId], updated);
    },
  });
}
