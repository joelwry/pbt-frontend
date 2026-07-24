import Link from "next/link";
import { Flag, XCircle, Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AttentionItem, AttentionIcon, UpcomingUnlock } from "@/features/admin-dashboard/types";

const ATTENTION_ICON: Record<AttentionIcon, typeof Flag> = {
  flag: Flag,
  payment: XCircle,
  event: Ticket,
};

const ATTENTION_ICON_BG: Record<AttentionIcon, string> = {
  flag: "bg-orange-tint text-orange-500",
  payment: "bg-[#FEE2E2] text-error",
  event: "bg-sky-tint text-sky-600",
};

export function NeedsAttentionCard({ items }: { items: AttentionItem[] }) {
  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-4">Needs Your Attention</h3>
      <ul className="space-y-4">
        {items.map((item) => {
          const Icon = ATTENTION_ICON[item.icon];
          return (
            <li key={item.id}>
              <Link href={item.href} className="flex items-start gap-3 group">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${ATTENTION_ICON_BG[item.icon]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary leading-snug group-hover:text-sky-600">
                    {item.title}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{item.subtitle}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export function UpcomingUnlocksCard({ unlocks }: { unlocks: UpcomingUnlock[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-base font-semibold text-text-primary">Upcoming Content Unlocks</h3>
        <Link href="/admin/content" className="text-sm font-semibold text-sky-600 hover:underline shrink-0">
          Manage →
        </Link>
      </div>
      <p className="text-sm text-text-muted mb-4">Scheduled to release automatically</p>
      <ul className="space-y-3">
        {unlocks.map((unlock) => (
          <li key={unlock.id} className="rounded-xl border border-border p-3.5">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center justify-center h-11 w-11 rounded-lg bg-sky-tint text-sky-600 shrink-0">
                <span className="text-[10px] font-bold leading-none uppercase">{unlock.month}</span>
                <span className="text-sm font-bold leading-none mt-0.5">{unlock.day}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-text-primary leading-snug">{unlock.title}</p>
                  <Badge variant="outline" className="shrink-0">
                    {unlock.badgeLabel}
                  </Badge>
                </div>
                <p className="text-xs text-text-muted mt-1">{unlock.moduleLabel}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
