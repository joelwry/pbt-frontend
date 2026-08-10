import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminRoadmapYears } from "@/features/admin-content/hooks/use-admin-content";

interface ContentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  year: string;
  onYearChange: (year: string) => void;
}

export function ContentToolbar({ search, onSearchChange, year, onYearChange }: ContentToolbarProps) {
  const { data: roadmapYears } = useAdminRoadmapYears();
  const yearTabs = [...(roadmapYears ?? []).map((y) => ({ value: y, label: y })), { value: "All", label: "All Years" }];

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search lessons by title or module"
          className="pl-10"
        />
      </div>

      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
        {yearTabs.map((t) => (
          <button
            key={t.value}
            onClick={() => onYearChange(t.value)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              year === t.value ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Button asChild>
        <Link href="/admin/content/new">
          <Plus className="h-4 w-4" />
          Add Lesson
        </Link>
      </Button>
    </div>
  );
}
