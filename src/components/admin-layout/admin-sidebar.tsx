"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import { AdminNavList } from "@/components/admin-layout/admin-nav-list";
import { BrandMark } from "@/components/shared/brand-mark";
import { useAdminAuth } from "@/providers/admin-auth-provider";

export function AdminSidebar() {
  const { admin, logout } = useAdminAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[248px] lg:shrink-0 h-screen sticky top-0 bg-linear-to-b from-navy-950 to-navy-900">
      <div className="h-1 w-full bg-linear-to-r from-orange-500 via-sky-500 to-navy-900 shrink-0" aria-hidden />
      <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-white/10">
        <BrandMark size={36} />
        <p className="font-display text-sm font-bold text-white leading-tight">
          Property Business
          <br />
          Training
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" data-scrollbar="on-dark">
        <AdminNavList />
      </nav>

      <div className="p-4 border-t border-white/10">
        {admin && (
          <div className="rounded-xl bg-white/5 px-3 py-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-orange-500 flex items-center justify-center text-navy-950 text-sm font-bold shrink-0">
                {admin.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{admin.fullName}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-tint px-2 py-0.5 text-[11px] font-semibold text-sky-600 mt-0.5">
                  <ShieldCheck className="h-3 w-3" />
                  {admin.role}
                </span>
              </div>
            </div>
            {/* <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <span className="text-[11px] text-white/40 uppercase tracking-wide">
                {admin.role === "Super Admin" ? "Admin ID" : "Staff ID"}
              </span>
              <span className="text-xs font-semibold text-white/80">{admin.adminId}</span>
            </div> */}
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
