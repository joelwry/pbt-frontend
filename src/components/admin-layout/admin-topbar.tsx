"use client";

import Link from "next/link";
import { BadgeCheck, ChevronDown, LogOut, ShieldCheck, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminAuth } from "@/providers/admin-auth-provider";

export function AdminTopbar() {
  const { admin, logout } = useAdminAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-end gap-3 h-[76px] px-6 lg:px-8 bg-white shadow-sm-pbt">
      {admin && (
        <>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5">
            <BadgeCheck className="h-3.5 w-3.5 text-sky-600" />
            <span className="text-xs text-text-muted">{admin.role === "Super Admin" ? "Admin ID" : "Staff ID"}</span>
            <span className="text-xs font-semibold text-text-primary">{admin.adminId}</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-sky-tint px-3.5 py-1.5 text-xs font-semibold text-sky-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            {admin.role}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full">
                <Avatar>
                  <AvatarFallback>{admin.initials}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-text-muted hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2.5 py-2">
                <p className="text-sm font-semibold text-text-primary truncate">{admin.fullName}</p>
                <p className="text-xs text-text-muted truncate">{admin.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">
                  <UserCircle className="h-4 w-4 text-text-muted" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={logout} className="text-error focus:text-error cursor-pointer">
                <LogOut className="h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </header>
  );
}
