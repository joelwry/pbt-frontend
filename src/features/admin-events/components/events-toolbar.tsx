import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EventFilterTab } from "@/features/admin-events/types";

const TABS: EventFilterTab[] = ["Upcoming", "Past", "Live Online", "In-Person", "Workshop"];

interface EventsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  tab: EventFilterTab;
  onTabChange: (tab: EventFilterTab) => void;
}

export function EventsToolbar({ search, onSearchChange, tab, onTabChange }: EventsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search events by title" className="pl-10" />
      </div>

      <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              tab === t ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <Button asChild>
        <Link href="/admin/events/new">
          <Plus className="h-4 w-4" />
          Add Event
        </Link>
      </Button>
    </div>
  );
}
