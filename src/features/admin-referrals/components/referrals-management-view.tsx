"use client";

import { useState } from "react";
import { Search, Gift, Users, Wallet, Clock3, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { useToast } from "@/providers/toast-provider";
import {
  useAdminReferralStats,
  useAdminReferralsPage,
  useMarkPaymentPending,
} from "@/features/admin-referrals/hooks/use-admin-referrals";
import { ReferralStatusBadge } from "@/features/admin-referrals/components/referral-status-badge";
import { MarkReferralPaidDialog } from "@/features/admin-referrals/components/mark-referral-paid-dialog";
import { REFERRAL_FILTER_OPTIONS, type AdminReferral, type ReferralFilterKey } from "@/features/admin-referrals/types";

export function ReferralsManagementView() {
  const { data: stats, isLoading: statsLoading } = useAdminReferralStats();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ReferralFilterKey | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isFetching } = useAdminReferralsPage(search, filter, page);
  const { mutate: markPending, isPending: markingPending, variables: pendingVariables } = useMarkPaymentPending();
  const { toast } = useToast();
  const [payingReferral, setPayingReferral] = useState<AdminReferral | null>(null);

  function handleSearchChange(next: string) {
    setSearch(next);
    setPage(1);
  }

  function handleFilterChange(next: ReferralFilterKey | undefined) {
    setFilter(next);
    setPage(1);
  }

  function handleMarkProcessing(referral: AdminReferral) {
    markPending(referral.id, {
      onSuccess: () => toast({ variant: "success", title: "Marked as processing", description: `${referral.referrerName}'s reward is now being processed.` }),
      onError: () => toast({ variant: "error", title: "Couldn't update referral", description: "Please try again." }),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Referrals" description="Track member-to-member referrals and the 10% first-payment rewards owed to them." />

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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={Users} iconVariant="navy" value={stats.totalReferrals.toLocaleString()} label="Total Referrals" linkLabel="View all" linkHref="/admin/referrals" />
          <StatCard icon={Gift} iconVariant="sky" value={`£${stats.totalRewardsEarned.toLocaleString()}`} label="Rewards Earned" linkLabel="View all" linkHref="/admin/referrals" />
          <StatCard icon={Clock3} iconVariant="orange" value={`£${stats.totalRewardsOutstanding.toLocaleString()}`} label="Outstanding (Not Yet Paid)" linkLabel="View all" linkHref="/admin/referrals" />
          <StatCard icon={Wallet} iconVariant="navy" value={`£${stats.totalRewardsPaid.toLocaleString()}`} label="Rewards Paid" linkLabel="View all" linkHref="/admin/referrals" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
          <button
            onClick={() => handleFilterChange(undefined)}
            className={cn(
              "inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              filter === undefined ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
            )}
          >
            All
          </button>
          {REFERRAL_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleFilterChange(opt.key)}
              className={cn(
                "inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                filter === opt.key ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by member name or email"
            className="pl-10"
          />
        </div>
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
          <EmptyState icon={Gift} title="No referrals found" description="Try a different filter or search term." />
        ) : (
          <>
            <div className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
                    <th className="py-3 pr-4">Referrer</th>
                    <th className="py-3 pr-4">Referred Member</th>
                    <th className="py-3 pr-4">Plan</th>
                    <th className="py-3 pr-4">First Payment</th>
                    <th className="py-3 pr-4">Reward (10%)</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 text-right">Action</th>
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
                      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">{referral.tierLabel ?? "—"}</td>
                      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">
                        {referral.firstPaymentAmount !== null ? `£${referral.firstPaymentAmount}` : "—"}
                      </td>
                      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">
                        {referral.rewardAmount !== null ? `£${referral.rewardAmount}` : "—"}
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <ReferralStatusBadge status={referral.status} label={referral.statusLabel} />
                        {referral.status === "PAID" && referral.paidDateLabel && (
                          <p className="text-[11px] text-text-muted mt-1">Paid {referral.paidDateLabel}</p>
                        )}
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        {referral.status === "REWARD_EARNED" && (
                          <div className="inline-flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleMarkProcessing(referral)}
                              disabled={markingPending && pendingVariables === referral.id}
                            >
                              {markingPending && pendingVariables === referral.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                              Mark Processing
                            </Button>
                            <Button size="sm" onClick={() => setPayingReferral(referral)}>
                              Mark Paid
                            </Button>
                          </div>
                        )}
                        {referral.status === "PAYMENT_PENDING" && (
                          <Button size="sm" onClick={() => setPayingReferral(referral)}>
                            Mark Paid
                          </Button>
                        )}
                      </td>
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

      <MarkReferralPaidDialog referral={payingReferral} open={payingReferral !== null} onOpenChange={(open) => !open && setPayingReferral(null)} />
    </div>
  );
}
