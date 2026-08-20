import { ShieldCheck } from "lucide-react";
import type { AdminUser } from "@/features/admin-auth/types";
import { accessibleSectionLabels } from "@/features/admin-auth/permissions";
import { ADMIN_ROLE_LABELS } from "@/features/admin-auth/types";

function formatAccessList(sectionLabels: string[]): string {
  const items = [...sectionLabels, "your own Profile"];
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function RestrictedAccessBanner({ admin }: { admin: AdminUser }) {
  const labels = accessibleSectionLabels(admin);

  return (
    <div className="rounded-[var(--radius-card)] bg-sky-tint border border-sky-500/20 p-5 flex items-start gap-4">
      <div className="h-10 w-10 rounded-xl bg-white text-sky-600 flex items-center justify-center shrink-0">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary">
          You&apos;re signed in as {/^[aeiou]/i.test(ADMIN_ROLE_LABELS[admin.role]) ? "an" : "a"}{" "}
          {ADMIN_ROLE_LABELS[admin.role]}
        </p>
        <p className="text-sm text-text-secondary mt-1">
          Your access is limited to {formatAccessList(labels)}. Locked sections in the sidebar aren&apos;t part of your
          role — contact a Super Admin if you need broader access.
        </p>
      </div>
    </div>
  );
}
