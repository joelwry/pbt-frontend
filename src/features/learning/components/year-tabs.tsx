import { ChevronDown } from "lucide-react";
import type { YearOption } from "@/features/learning/types";

interface YearTabsProps {
  years: YearOption[];
  activeYear: string;
  onSelect: (year: string) => void;
}

// A drop-down select, not tabs — years only ever run backward from the
// current one (the backend already excludes anything in the future), so a
// small select reads more naturally than a row of pills. See docs/ui_adjustment.md.
export function YearTabs({ years, activeYear, onSelect }: YearTabsProps) {
  return (
    <div className="relative inline-block">
      <select
        value={activeYear}
        onChange={(e) => onSelect(e.target.value)}
        aria-label="Roadmap year"
        className="appearance-none rounded-xl border border-border bg-white pl-4 pr-9 py-2.5 text-sm font-semibold text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        {years.map((year) => (
          <option key={year.year} value={year.year}>
            {year.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
    </div>
  );
}
