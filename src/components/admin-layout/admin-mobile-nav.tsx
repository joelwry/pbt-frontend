"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { BrandMark } from "@/components/shared/brand-mark";
import { AdminNavList } from "@/components/admin-layout/admin-nav-list";
import { useState } from "react";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-text-primary"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] max-w-[80vw] bg-gradient-to-b from-navy-950 to-navy-900 p-0">
          <VisuallyHidden>
            <SheetTitle>Navigation</SheetTitle>
          </VisuallyHidden>
          <div className="px-5 pt-6 pb-4 flex items-center gap-3 border-b border-white/10">
            <BrandMark size={36} />
            <p className="font-display text-sm font-bold text-white leading-tight">
              Property Business
              <br />
              Training
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" data-scrollbar="on-dark">
            <AdminNavList onNavigate={() => setOpen(false)} />
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
