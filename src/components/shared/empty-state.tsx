import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-14 px-6 rounded-[var(--radius-card)] border border-dashed border-border bg-[#FAFCFD]",
        className
      )}
    >
      <div className="h-12 w-12 rounded-full bg-sky-tint flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-sky-600" strokeWidth={1.75} />
      </div>
      <p className="font-display font-semibold text-text-primary">{title}</p>
      {description && (
        <p className="text-sm text-text-muted mt-1.5 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
