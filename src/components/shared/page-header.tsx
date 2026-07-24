import { BackLink } from "@/components/shared/back-link";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({ title, description, actions, backHref, backLabel = "Back" }: PageHeaderProps) {
  return (
    <div className="space-y-3">
      {backHref && <BackLink href={backHref} label={backLabel} />}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold text-text-primary break-words">{title}</h1>
          {description && <p className="text-sm text-text-muted mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}
