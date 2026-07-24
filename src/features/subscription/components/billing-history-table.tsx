"use client";

import { useState } from "react";
import { Download, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { useInvoicesPage } from "@/features/subscription/hooks/use-subscription";
import type { InvoiceStatus } from "@/features/subscription/types";

const STATUS_VARIANT: Record<InvoiceStatus, "success" | "warning" | "error"> = {
  Paid: "success",
  Pending: "warning",
  Failed: "error",
};

export function BillingHistoryTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch, isFetching } = useInvoicesPage(page);

  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-semibold text-text-primary">Billing History</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data.items.length === 0 ? (
        <EmptyState icon={Receipt} title="No invoices yet" />
      ) : (
        <>
          <div className={`overflow-x-auto transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
                  <th className="py-2.5 pr-4">Invoice</th>
                  <th className="py-2.5 pr-4">Date</th>
                  <th className="py-2.5 pr-4">Amount</th>
                  <th className="py-2.5 pr-4">Status</th>
                  <th className="py-2.5 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="py-3 pr-4 text-text-primary font-medium whitespace-nowrap">{invoice.invoiceNumber}</td>
                    <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">{invoice.dateLabel}</td>
                    <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">{invoice.amountLabel}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={STATUS_VARIANT[invoice.status]}>{invoice.status}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <button className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-text-primary">
                        <Download className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </Card>
  );
}
