"use client";

import { GraduationCap, MessageSquare, Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ActivityLogItem } from "@/features/admin-members/types";

const ACTIVITY_ICON = { lesson: GraduationCap, community: MessageSquare, event: Ticket };
const ACTIVITY_ICON_BG = {
  lesson: "bg-sky-tint text-sky-600",
  community: "bg-orange-tint text-orange-500",
  event: "bg-[#F1F5F9] text-slate-500",
};

export function RecentActivityCard({ items }: { items: ActivityLogItem[] }) {
  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Recent Activity</h3>
      <ul className="space-y-4">
        {items.map((item) => {
          const Icon = ACTIVITY_ICON[item.icon];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0", ACTIVITY_ICON_BG[item.icon])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-text-primary">{item.description}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.timeAgoLabel}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "learning", label: "Learning Progress" },
  { value: "billing", label: "Billing History" },
  { value: "activity", label: "Activity Log" },
] as const;

export type MemberDetailTab = (typeof TABS)[number]["value"];

export function MemberDetailTabs({ active, onChange }: { active: MemberDetailTab; onChange: (tab: MemberDetailTab) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-white p-1 overflow-x-auto max-w-full">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-lg px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
            active === tab.value ? "bg-navy-900 text-white" : "text-text-secondary hover:bg-[#F5F8FA]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
