import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { RegionTabs } from "@/components/shared/region-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AdminLeaderRegion } from "@/features/admin-leaders/types";

const REGIONS: readonly AdminLeaderRegion[] = ["North West", "Midlands", "London & South East", "Scotland"];

interface LeadersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  region: AdminLeaderRegion | "All";
  onRegionChange: (region: AdminLeaderRegion | "All") => void;
}

export function LeadersToolbar({ search, onSearchChange, region, onRegionChange }: LeadersToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[220px] max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search leaders by name" className="pl-10" />
      </div>

      <RegionTabs regions={REGIONS} active={region} onSelect={onRegionChange} />

      <Button asChild>
        <Link href="/admin/pbt-leaders/new">
          <Plus className="h-4 w-4" />
          Add Leader
        </Link>
      </Button>
    </div>
  );
}
