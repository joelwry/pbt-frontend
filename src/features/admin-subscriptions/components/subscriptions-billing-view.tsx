"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscriptionStats, useInvoicesPage } from "@/features/admin-subscriptions/hooks/use-admin-subscriptions";
import { AdminSubscriptionsStatsRow } from "@/features/admin-subscriptions/components/admin-subscriptions-stats-row";
import { RevenueByTierCard } from "@/features/admin-subscriptions/components/revenue-by-tier-card";
import { InvoicesToolbar } from "@/features/admin-subscriptions/components/invoices-toolbar";
import { InvoicesTable } from "@/features/admin-subscriptions/components/invoices-table";
import { MentorshipAssignmentsCard } from "@/features/admin-subscriptions/components/mentorship-assignments-card";
import { PricingSettingsCard } from "@/features/admin-pricing/components/pricing-settings-card";
import type { InvoiceStatus } from "@/features/admin-subscriptions/types";

export function SubscriptionsBillingView() {
  const { data: stats, isLoading: statsLoading } = useSubscriptionStats();
  const [status, setStatus] = useState<InvoiceStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useInvoicesPage(status, search, page);

  function handleStatusChange(next: InvoiceStatus | "All") {
    setStatus(next);
    setPage(1);
  }
  function handleSearchChange(next: string) {
    setSearch(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions & Billing" description="Platform-wide revenue, tiers and payment status." />

      {statsLoading || !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-10 w-10 rounded-xl mb-4" />
              <Skeleton className="h-7 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </Card>
          ))}
        </div>
      ) : (
        <AdminSubscriptionsStatsRow stats={stats} />
      )}

      <RevenueByTierCard />

      <PricingSettingsCard />

      <MentorshipAssignmentsCard />

      <InvoicesToolbar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        exportableInvoices={data?.items ?? []}
      />

      <Card>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : isError || !data ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={CreditCard} title="No invoices found" description="Try a different filter or search term." />
        ) : (
          <>
            <div className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}>
              <InvoicesTable invoices={data.items} />
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border flex-wrap gap-3">
              <p className="text-sm text-text-muted">
                Showing {data.items.length} of {data.pagination.totalItems}
              </p>
              <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
