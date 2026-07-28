"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Receipt } from "lucide-react";
import { useMemberBilling, useMemberLearningProgress } from "@/features/admin-members/hooks/use-admin-members";
import type { AdminMemberDetail } from "@/features/admin-members/types";

export function LearningProgressTab({ member }: { member: AdminMemberDetail }) {
  const { data, isLoading, isError, refetch } = useMemberLearningProgress(member.id);

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-1">Learning Progress</h3>
      <p className="text-sm text-text-muted mb-5">
        {member.lessonsCompleted} lessons completed · {member.studyHours} study hours total
      </p>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-text-primary">Overall Roadmap Progress</p>
              <span className="text-xs font-semibold text-text-muted">{data.overallProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#EDF1F4] overflow-hidden">
              <div className="h-full rounded-full bg-sky-500" style={{ width: `${data.overallProgress}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <p className="text-2xl font-display font-bold text-text-primary">{data.completedModulesCount}</p>
              <p className="text-xs text-text-muted mt-0.5">Modules completed</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-text-primary">{data.streakDays}</p>
              <p className="text-xs text-text-muted mt-0.5">Day streak</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-text-primary">{Math.round(data.totalLearningMinutes / 60)}</p>
              <p className="text-xs text-text-muted mt-0.5">Total hours</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export function BillingHistoryTab({ member }: { member: AdminMemberDetail }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useMemberBilling(member.id, page);
  const STATUS_VARIANT = { Paid: "success" as const };

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-1">Billing History</h3>
      <p className="text-sm text-text-muted mb-5">Payment method on file: {member.paymentMethodLabel}</p>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={Receipt} title="No billing history" description="This member has no subscription records yet." />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
                  <th className="py-2.5 pr-4">Description</th>
                  <th className="py-2.5 pr-4">Date</th>
                  <th className="py-2.5 pr-4">Amount</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3 pr-4 text-text-primary font-medium">{row.label}</td>
                    <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">{row.dateLabel}</td>
                    <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">£{row.amount.toFixed(2)}</td>
                    <td className="py-3">
                      <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} className="mt-4" />
        </>
      )}
    </Card>
  );
}
