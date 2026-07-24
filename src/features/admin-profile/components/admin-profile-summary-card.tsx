import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AdminUser } from "@/features/admin-auth/types";

export function AdminProfileSummaryCard({ admin }: { admin: AdminUser }) {
  return (
    <Card className="text-center">
      <div className="h-20 w-20 rounded-full bg-orange-500 text-navy-950 text-2xl font-bold flex items-center justify-center mx-auto">
        {admin.initials}
      </div>
      <p className="font-display text-base font-semibold text-text-primary mt-3">{admin.fullName}</p>
      <div className="mt-1.5 flex items-center justify-center">
        <Badge variant={admin.role === "Super Admin" ? "navy" : "sky"}>{admin.role}</Badge>
      </div>
      <p className="text-xs text-text-muted mt-2">
        {admin.role === "Super Admin" ? "Admin ID" : "Staff ID"}: {admin.adminId}
      </p>
    </Card>
  );
}
