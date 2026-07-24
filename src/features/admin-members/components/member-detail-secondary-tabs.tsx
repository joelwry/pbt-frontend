import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AdminMemberDetail } from "@/features/admin-members/types";

const MODULES = [
  { title: "Module 1 · Foundations of Property Investing" },
  { title: "Module 2 · Deal Structuring & Finance" },
  { title: "Module 3 · Portfolio Growth & Scaling" },
];

export function LearningProgressTab({ member }: { member: AdminMemberDetail }) {
  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-1">Learning Progress</h3>
      <p className="text-sm text-text-muted mb-5">
        {member.lessonsCompleted} lessons completed · {member.studyHours} study hours total
      </p>
      <div className="space-y-5">
        {MODULES.map((module, i) => {
          const percent = Math.max(0, Math.min(100, 100 - i * 35 - (member.lessonsCompleted % 7) * 2));
          return (
            <div key={module.title}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-text-primary">{module.title}</p>
                <span className="text-xs font-semibold text-text-muted">{percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#EDF1F4] overflow-hidden">
                <div className="h-full rounded-full bg-sky-500" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function BillingHistoryTab({ member }: { member: AdminMemberDetail }) {
  const rows = [
    { id: "b1", label: "Membership renewal", dateLabel: member.renewalDateLabel, status: "Paid" as const },
    { id: "b2", label: "Membership renewal", dateLabel: "1 month prior", status: "Paid" as const },
    { id: "b3", label: "Membership renewal", dateLabel: "2 months prior", status: member.status === "Payment Failed" ? "Failed" as const : "Paid" as const },
  ];
  const STATUS_VARIANT = { Paid: "success" as const, Failed: "error" as const };

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-1">Billing History</h3>
      <p className="text-sm text-text-muted mb-5">Payment method on file: {member.paymentMethodLabel}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
              <th className="py-2.5 pr-4">Description</th>
              <th className="py-2.5 pr-4">Date</th>
              <th className="py-2.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="py-3 pr-4 text-text-primary font-medium">{row.label}</td>
                <td className="py-3 pr-4 text-text-secondary whitespace-nowrap">{row.dateLabel}</td>
                <td className="py-3">
                  <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
