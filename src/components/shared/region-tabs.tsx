import { cn } from "@/lib/utils";

interface RegionTabsProps<T extends string> {
  regions: readonly T[];
  active: T | "All";
  onSelect: (region: T | "All") => void;
  allLabel?: string;
}

export function RegionTabs<T extends string>({ regions, active, onSelect, allLabel = "All Regions" }: RegionTabsProps<T>) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
      <button
        onClick={() => onSelect("All")}
        className={cn(
          "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
          active === "All" ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
        )}
      >
        {allLabel}
      </button>
      {regions.map((region) => (
        <button
          key={region}
          onClick={() => onSelect(region)}
          className={cn(
            "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
            active === region ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
          )}
        >
          {region}
        </button>
      ))}
    </div>
  );
}
