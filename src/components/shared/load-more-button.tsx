import { Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  hasMore: boolean;
  isLoading: boolean;
  onClick: () => void;
  loadedLabel?: string;
}

export function LoadMoreButton({ hasMore, isLoading, onClick, loadedLabel }: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <Button variant="secondary" onClick={onClick} disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
        {isLoading ? "Loading…" : "Load More"}
      </Button>
      {loadedLabel && <p className="text-xs text-text-muted">{loadedLabel}</p>}
    </div>
  );
}
