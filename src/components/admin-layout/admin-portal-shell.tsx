import { AdminSidebar } from "@/components/admin-layout/admin-sidebar";
import { AdminTopbar } from "@/components/admin-layout/admin-topbar";
import { AdminMobileNav } from "@/components/admin-layout/admin-mobile-nav";
import { BrandMark } from "@/components/shared/brand-mark";

export function AdminPortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white border-b border-border">
          <AdminMobileNav />
          <div className="flex items-center gap-2">
            <BrandMark size={28} className="border border-border" />
            <span className="font-display text-sm font-bold text-text-primary">
              Property Business Training
            </span>
          </div>
        </div>
        <AdminTopbar />
        <main className="flex-1 px-6 lg:px-8 py-6 lg:py-8 space-y-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
