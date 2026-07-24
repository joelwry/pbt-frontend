"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "@/components/layout/nav-config";
import { BrandMark } from "@/components/shared/brand-mark";
import { useAuth } from "@/providers/auth-provider";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import { MEMBERSHIP_BADGE } from "@/features/session/membership-badge";
import { Skeleton } from "@/components/ui/skeleton";

export function Sidebar() {
  const pathname = usePathname();
  const { data: member, isLoading } = useCurrentMember();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[248px] lg:shrink-0 h-screen sticky top-0 bg-gradient-to-b from-navy-950 to-navy-900 border-t-4 border-t-transparent">
      <div
        className="h-1 w-full bg-gradient-to-r from-orange-500 via-sky-500 to-navy-900 shrink-0"
        aria-hidden
      />
      <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-white/10">
        <BrandMark size={36} />
        <p className="font-display text-sm font-bold text-white leading-tight">
          Property Business
          <br />
          Training
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 text-[11px] font-semibold tracking-wider text-white/40 uppercase mb-2">
              {section.label}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-orange-500 text-navy-950 font-semibold"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
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
      </nav>

      <div className="p-4 border-t border-white/10">
        {isLoading || !member ? (
          <div className="flex items-center gap-3 px-1 py-1">
            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-24 bg-white/10" />
              <Skeleton className="h-3 w-16 bg-white/10" />
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white/5 px-3 py-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-orange-500 flex items-center justify-center text-navy-950 text-sm font-bold shrink-0">
                {member.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{member.fullName}</p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold mt-0.5",
                    MEMBERSHIP_BADGE[member.membershipTier].badgeClass
                  )}
                >
                  {MEMBERSHIP_BADGE[member.membershipTier].label}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-[11px] text-white/40 uppercase tracking-wide">Client ID</span>
              <span className="text-xs font-semibold text-white/80">{member.clientId}</span>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
