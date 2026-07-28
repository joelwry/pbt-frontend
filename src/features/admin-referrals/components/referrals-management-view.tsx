"use client";

import { useState } from "react";
import { Search, Gift, Users, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { useAdminReferralStats, useAdminReferralsPage } from "@/features/admin-referrals/hooks/use-admin-referrals";

export function ReferralsManagementView() {
  const { data: stats, isLoading: statsLoading } = useAdminReferralStats();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isFetching } = useAdminReferralsPage(search, page);

  function handleSearchChange(next: string) {
    setSearch(next);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Referrals" description="Track member-to-member referrals and rewards issued." />

      {statsLoading || !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-10 w-10 rounded-xl mb-4" />
              <Skeleton className="h-7 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            icon={Users}
            iconVariant="navy"
            value={stats.totalReferrals.toLocaleString()}
            label="Total Referrals"
            linkLabel="View all"
            linkHref="/admin/referrals"
          />
          <StatCard
            icon={Wallet}
            iconVariant="orange"
            value={`£${stats.totalRewardsIssued.toLocaleString()}`}
            label="Total Rewards Issued"
            linkLabel="View all"
            linkHref="/admin/referrals"
          />
        </div>
      )}

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by member name or email"
          className="pl-10"
        />
      </div>

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
          <EmptyState icon={Gift} title="No referrals yet" description="Successful member referrals will appear here." />
        ) : (
          <>
            <div className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
                    <th className="py-3 pr-4">Referrer</th>
                    <th className="py-3 pr-4">Referred Member</th>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 text-right">Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.items.map((referral) => (
                    <tr key={referral.id}>
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-text-primary">{referral.referrerName}</p>
                        <p className="text-xs text-text-muted">{referral.referrerEmail}</p>
                      </td>
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-text-primary">{referral.referredName}</p>
                        <p className="text-xs text-text-muted">{referral.referredEmail}</p>
                      </td>
                      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">{referral.dateLabel}</td>
                      <td className="py-3.5 text-right text-text-secondary whitespace-nowrap">£{referral.rewardAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
