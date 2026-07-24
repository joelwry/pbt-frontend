import { cn } from "@/lib/utils";
import type { YearOption } from "@/features/learning/types";

interface YearTabsProps {
  years: YearOption[];
  activeYear: string;
  onSelect: (year: string) => void;
}

export function YearTabs({ years, activeYear, onSelect }: YearTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
      {years.map((year) => (
        <button
          key={year.year}
          onClick={() => onSelect(year.year)}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
            activeYear === year.year ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
          )}
        >
          {year.label}
        </button>
      ))}
    </div>
  );
}
