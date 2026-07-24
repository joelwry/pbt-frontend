import { useQuery } from "@tanstack/react-query";
import { plusService } from "@/features/plus/services/plus.service";

export function usePlusPage() {
  return useQuery({
    queryKey: ["plus", "page"],
    queryFn: plusService.getPlusPage,
    staleTime: 10 * 60 * 1000,
  });
}
