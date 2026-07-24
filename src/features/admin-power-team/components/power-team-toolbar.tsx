import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { AdminPartnerCategory } from "@/features/admin-power-team/types";

const CATEGORY_TABS: { value: AdminPartnerCategory | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Solicitors", label: "Solicitors" },
  { value: "Mortgage Brokers", label: "Mortgage Brokers" },
  { value: "Accountants", label: "Accountants" },
  { value: "Surveyors", label: "Surveyors" },
];

interface PowerTeamToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: AdminPartnerCategory | "All";
  onCategoryChange: (category: AdminPartnerCategory | "All") => void;
}

export function PowerTeamToolbar({ search, onSearchChange, category, onCategoryChange }: PowerTeamToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search partners by name" className="pl-10" />
      </div>

      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
        {CATEGORY_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => onCategoryChange(t.value)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              category === t.value ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Button asChild>
        <Link href="/admin/power-team/new">
          <Plus className="h-4 w-4" />
          Add Partner
        </Link>
      </Button>
    </div>
  );
}
