import { useInfiniteQuery } from "@tanstack/react-query";
import { powerTeamService } from "@/features/power-team/services/power-team.service";
import type { PartnerCategory } from "@/features/power-team/types";

const PARTNERS_PAGE_SIZE = 8;

/** Load More feed for the Power Team grid. enabled: false while the member's tier can't access it -- avoids firing a request the backend will 403 (Plus/Masterplan Programme only). */
export function usePartnersFeed(category: PartnerCategory | "All", search: string, enabled: boolean = true) {
  return useInfiniteQuery({
    queryKey: ["power-team", "feed", category, search],
    queryFn: ({ pageParam }) =>
      powerTeamService.getPartnersPage({ category, search, page: pageParam, limit: PARTNERS_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined),
    enabled,
  });
}
