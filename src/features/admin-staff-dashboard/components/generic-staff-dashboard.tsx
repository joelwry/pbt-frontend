import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { LayoutGrid } from "lucide-react";
import { ADMIN_NAV_SECTIONS } from "@/components/admin-layout/admin-nav-config";
import type { AdminUser } from "@/features/admin-auth/types";
import { hasSection } from "@/features/admin-auth/permissions";

export function GenericStaffDashboard({ admin }: { admin: AdminUser }) {
  const accessibleItems = ADMIN_NAV_SECTIONS.flatMap((section) => section.items).filter(
    (item) => item.section && hasSection(admin, item.section)
  );

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-1">Quick Access</h3>
      <p className="text-sm text-text-muted mb-5">The sections available to your role.</p>

      {accessibleItems.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="No sections assigned yet" description="Ask a Super Admin to grant you access." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {accessibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-[#F5F8FA] hover:border-sky-500/40 transition-colors group"
              >
                <div className="h-10 w-10 rounded-xl bg-sky-tint text-sky-600 flex items-center justify-center shrink-0">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <span className="text-sm font-semibold text-text-primary flex-1">{item.label}</span>
                <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-sky-600 shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}
