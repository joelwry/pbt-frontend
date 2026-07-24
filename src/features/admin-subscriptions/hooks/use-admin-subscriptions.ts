import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { adminSubscriptionsService } from "@/features/admin-subscriptions/services/admin-subscriptions.service";
import type { InvoiceStatus } from "@/features/admin-subscriptions/types";

export function useSubscriptionStats() {
  return useQuery({ queryKey: ["admin", "subscriptions", "stats"], queryFn: adminSubscriptionsService.getStats });
}

export function useRevenueByTier() {
  return useQuery({ queryKey: ["admin", "subscriptions", "revenue-by-tier"], queryFn: adminSubscriptionsService.getRevenueByTier });
}

export function useInvoicesPage(status: InvoiceStatus | "All", search: string, page: number) {
  return useQuery({
    queryKey: ["admin", "subscriptions", "invoices", status, search, page],
    queryFn: () => adminSubscriptionsService.getInvoicesPage({ status, search, page, limit: 4 }),
    placeholderData: keepPreviousData,
  });
}
