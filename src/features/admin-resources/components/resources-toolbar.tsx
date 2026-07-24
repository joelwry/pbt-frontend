import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { AdminResourceCategory } from "@/features/admin-resources/types";

const CATEGORY_TABS: { value: AdminResourceCategory | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Template", label: "Templates" },
  { value: "Guide", label: "Guides" },
  { value: "Webinar", label: "Webinars" },
  { value: "Toolkit", label: "Toolkits" },
];

interface ResourcesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: AdminResourceCategory | "All";
  onCategoryChange: (category: AdminResourceCategory | "All") => void;
}

export function ResourcesToolbar({ search, onSearchChange, category, onCategoryChange }: ResourcesToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resources by name"
          className="pl-10"
        />
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
        <Link href="/admin/resources/new">
          <Plus className="h-4 w-4" />
          Add Resource
        </Link>
      </Button>
    </div>
  );
}
