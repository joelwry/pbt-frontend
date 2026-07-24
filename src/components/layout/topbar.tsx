"use client";

import { BadgeCheck, ChevronDown, LogOut, Settings, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentMember } from "@/features/session/hooks/use-current-member";
import { MEMBERSHIP_BADGE } from "@/features/session/membership-badge";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";

export function Topbar() {
  const { data: member, isLoading } = useCurrentMember();
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-end gap-3 h-[76px] px-6 lg:px-8 bg-white shadow-sm-pbt">
      {isLoading || !member ? (
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      ) : (
        <>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5">
            <BadgeCheck className="h-3.5 w-3.5 text-sky-600" />
            <span className="text-xs text-text-muted">Client ID</span>
            <span className="text-xs font-semibold text-text-primary">{member.clientId}</span>
          </div>

          <span
            className={cn(
              "hidden sm:inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold",
              MEMBERSHIP_BADGE[member.membershipTier].badgeClass
            )}
          >
            {MEMBERSHIP_BADGE[member.membershipTier].label}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-full">
                <Avatar>
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-text-muted hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2.5 py-2">
                <p className="text-sm font-semibold text-text-primary truncate">{member.fullName}</p>
                <p className="text-xs text-text-muted truncate">{member.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserCircle className="h-4 w-4 text-text-muted" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/my-subscription">
                  <Settings className="h-4 w-4 text-text-muted" />
                  My Subscription
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
