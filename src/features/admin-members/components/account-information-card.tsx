import { Card } from "@/components/ui/card";
import type { AdminMemberDetail } from "@/features/admin-members/types";

export function AccountInformationCard({ member }: { member: AdminMemberDetail }) {
  const fields: { label: string; value: string }[] = [
    { label: "Full Name", value: member.fullName },
    { label: "Phone", value: member.phone },
    { label: "Location", value: member.location },
    { label: "Assigned Leader", value: member.assignedLeader },
    { label: "Renewal Date", value: member.renewalDateLabel },
    { label: "Payment Method", value: member.paymentMethodLabel },
  ];

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Account Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">{field.label}</p>
            <p className="text-sm text-text-primary mt-1.5">{field.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
