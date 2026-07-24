import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { leadersService } from "@/features/leaders/services/leaders.service";
import type { LeaderRegion } from "@/features/leaders/types";

const LEADERS_PAGE_SIZE = 8;

/** Load More feed for the Leaders grid — filters (region/search) reset the feed via the query key. */
export function useLeadersFeed(region: LeaderRegion | "All", search: string) {
  return useInfiniteQuery({
    queryKey: ["leaders", "feed", region, search],
    queryFn: ({ pageParam }) =>
      leadersService.getLeadersPage({ region, search, page: pageParam, limit: LEADERS_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined),
  });
}

export function useLeader(id: string) {
  return useQuery({
    queryKey: ["leaders", "detail", id],
    queryFn: () => leadersService.getLeaderById(id),
    enabled: Boolean(id),
  });
}
