import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-14 px-6 rounded-[var(--radius-card)] border border-border bg-white",
        className
      )}
    >
      <div className="h-12 w-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-error" strokeWidth={1.75} />
      </div>
      <p className="font-display font-semibold text-text-primary">{title}</p>
      <p className="text-sm text-text-muted mt-1.5 max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
          <RotateCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}
