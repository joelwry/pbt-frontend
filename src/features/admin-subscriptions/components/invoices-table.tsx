import { Badge } from "@/components/ui/badge";
import { TIER_LABEL } from "@/features/admin-members/tier-labels";
import type { Invoice, InvoiceStatus, MembershipTier } from "@/features/admin-subscriptions/types";

const TIER_VARIANT: Record<MembershipTier, "slate" | "sky" | "orange"> = {
  Pathway: "slate",
  Plus: "sky",
  Mentorship: "orange",
};

const STATUS_VARIANT: Record<InvoiceStatus, "success" | "error" | "outline"> = {
  Paid: "success",
  Failed: "error",
  Refunded: "outline",
};

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
            <th className="py-3 pr-4">Member</th>
            <th className="py-3 pr-4">Tier</th>
            <th className="py-3 pr-4">Amount</th>
            <th className="py-3 pr-4">Date</th>
            <th className="py-3 pr-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td className="py-3.5 pr-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-orange-500 text-navy-950 text-xs font-bold flex items-center justify-center shrink-0">
                    {invoice.memberInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary truncate">{invoice.memberName}</p>
                    <p className="text-xs text-text-muted">{invoice.invoiceNumber}</p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 pr-4">
                <Badge variant={TIER_VARIANT[invoice.tier]}>{TIER_LABEL[invoice.tier]}</Badge>
              </td>
              <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">£{invoice.amount.toFixed(2)}</td>
              <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">{invoice.dateLabel}</td>
              <td className="py-3.5 pr-4">
                <Badge variant={STATUS_VARIANT[invoice.status]}>{invoice.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
