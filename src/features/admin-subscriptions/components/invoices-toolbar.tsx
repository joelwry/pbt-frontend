"use client";

import { Search, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Invoice, InvoiceStatus } from "@/features/admin-subscriptions/types";

const STATUS_TABS: { value: InvoiceStatus | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Paid", label: "Paid" },
  { value: "Failed", label: "Failed" },
  { value: "Refunded", label: "Refunded" },
];

function exportInvoicesToCsv(invoices: Invoice[]) {
  const header = ["Invoice", "Member", "Tier", "Amount", "Date", "Status"];
  const rows = invoices.map((inv) => [inv.invoiceNumber, inv.memberName, inv.tier, inv.amount.toFixed(2), inv.dateLabel, inv.status]);
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pbt-invoices-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

interface InvoicesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: InvoiceStatus | "All";
  onStatusChange: (status: InvoiceStatus | "All") => void;
  exportableInvoices: Invoice[];
}

export function InvoicesToolbar({ search, onSearchChange, status, onStatusChange, exportableInvoices }: InvoicesToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by member name or invoice"
          className="pl-10"
        />
      </div>

      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => onStatusChange(t.value)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              status === t.value ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Button onClick={() => exportInvoicesToCsv(exportableInvoices)} disabled={exportableInvoices.length === 0}>
        <FileDown className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}
