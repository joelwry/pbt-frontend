"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_SECTIONS } from "@/components/admin-layout/admin-nav-config";
import { canAccessAdminNavItem } from "@/features/admin-auth/permissions";
import { useAdminAuth } from "@/providers/admin-auth-provider";

export function AdminNavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { admin } = useAdminAuth();

  return (
    <>
      {ADMIN_NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="px-3 text-[11px] font-semibold tracking-wider text-white/40 uppercase mb-2">{section.label}</p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const isLocked = !admin || !canAccessAdminNavItem(admin, item);
              const Icon = item.icon;

              if (isLocked) {
                return (
                  <li key={item.href}>
                    <div
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/30 cursor-not-allowed"
                      aria-disabled="true"
                      title={`${item.label} isn't part of your role`}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                      <span className="flex-1 truncate">{item.label}</span>
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-orange-500 text-navy-950 font-semibold" : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
