import { ADMIN_SECTION_LABELS } from "@/features/admin-auth/permissions";
import type { AdminAccount } from "@/features/admin-users/types";

export function accessScopeLabel(account: AdminAccount): string {
  if (account.role === "Super Admin") return "Full Access";
  const labels = account.sections.map((s) => ADMIN_SECTION_LABELS[s]);
  const base = labels.length > 0 ? labels.join(", ") : "No sections assigned";
  return account.accessNote ? `${base} ${account.accessNote}` : base;
}
