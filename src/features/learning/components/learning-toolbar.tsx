import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LearningToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function LearningToolbar({ search, onSearchChange }: LearningToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" size="default" className="shrink-0">
        <SlidersHorizontal className="h-4 w-4" />
        Filter
      </Button>
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search modules"
          className="pl-10"
        />
      </div>
    </div>
  );
}
