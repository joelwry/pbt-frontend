import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  iconVariant: "navy" | "orange" | "slate" | "sky";
  topRight?: React.ReactNode;
  value: string;
  label: string;
  linkLabel?: string;
  linkHref?: string;
}

const ICON_BG: Record<StatCardProps["iconVariant"], string> = {
  navy: "bg-navy-900 text-white",
  orange: "bg-orange-tint text-orange-500",
  slate: "bg-[#F1F5F9] text-slate-500",
  sky: "bg-sky-tint text-sky-600",
};

export function StatCard({ icon: Icon, iconVariant, topRight, value, label, linkLabel, linkHref }: StatCardProps) {
  return (
    <Card className="pbt-hover-lift p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", ICON_BG[iconVariant])}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </div>
        {topRight}
      </div>
      <p className="font-display text-[28px] leading-none font-bold text-text-primary">{value}</p>
      <p className="text-sm text-text-muted mt-1.5">{label}</p>
      { linkLabel &&  linkHref &&
        (<Link
          href={linkHref}
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 mt-3 hover:underline"
        >
          {linkLabel}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
        ) 
      }
    </Card>
  );
}

export function StatDelta({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#15803D]">
      <ArrowUpRight className="h-3 w-3" />
      {label}
    </span>
  );
}

export function StatChip({ label }: { label: string }) {
  return <span className="text-xs font-medium text-text-muted text-right leading-tight max-w-[70px]">{label}</span>;
}
