"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "@/components/layout/nav-config";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { BrandMark } from "@/components/shared/brand-mark";
import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
        <SheetContent
          side="left"
          className="w-[280px] max-w-[80vw] bg-gradient-to-b from-navy-950 to-navy-900 p-0"
        >
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
                          onClick={() => setOpen(false)}
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
        </SheetContent>
      </Sheet>
    </>
  );
}
