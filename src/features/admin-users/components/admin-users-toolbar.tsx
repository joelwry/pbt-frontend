import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AdminRole } from "@/features/admin-auth/types";

const ROLE_TABS: { value: AdminRole | "All"; label: string }[] = [
  { value: "All", label: "All Roles" },
  { value: "Super Admin", label: "Super Admin" },
  { value: "Content Manager", label: "Content Manager" },
  { value: "Community Moderator", label: "Community Moderator" },
  { value: "Support Staff", label: "Support Staff" },
];

interface AdminUsersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: AdminRole | "All";
  onRoleChange: (role: AdminRole | "All") => void;
}

export function AdminUsersToolbar({ search, onSearchChange, role, onRoleChange }: AdminUsersToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search by name or email" className="pl-10" />
      </div>

      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
        {ROLE_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => onRoleChange(t.value)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              role === t.value ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Button asChild>
        <Link href="/admin/admin-users/new">
          <Plus className="h-4 w-4" />
          Invite Admin User
        </Link>
      </Button>
    </div>
  );
}
