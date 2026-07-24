import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AddMemberDialog } from "@/features/admin-members/components/add-member-dialog";
import type { MembershipTier } from "@/features/session/types";

const TIER_TABS: { value: MembershipTier | "All"; label: string }[] = [
  { value: "All", label: "All Tiers" },
  { value: "Pathway", label: "Pathway" },
  { value: "Plus", label: "Plus" },
  { value: "Mentorship", label: "Mentorship" },
];

interface MembersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  tier: MembershipTier | "All";
  onTierChange: (tier: MembershipTier | "All") => void;
}

export function MembersToolbar({ search, onSearchChange, tier, onTierChange }: MembersToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search members by name, email or ID"
          className="pl-10"
        />
      </div>

      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
        {TIER_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => onTierChange(t.value)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              tier === t.value ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AddMemberDialog />
    </div>
  );
}
