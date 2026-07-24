"use client";

import { useState } from "react";
import { ChevronDown, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const DEMO_ACCOUNTS = [
  { email: "kudirat@olowosaleproperty.co.uk", label: "Mentorship · active", note: "Full access, normal session length" },
  { email: "alice.pathway@pbt.test", label: "Pathway · active", note: "Default tier, gated from Plus/Mentorship pages" },
  { email: "ben.plus@pbt.test", label: "Plus · active", note: "Gated from Mentorship-only pages" },
  { email: "carla.expired@pbt.test", label: "Pathway · expired", note: "Redirected to Renew Subscription on login" },
  { email: "derek.silentrefresh@pbt.test", label: "Plus · 20s access token", note: "Refreshes silently in the background — no redirect" },
  { email: "erin.forcedlogout@pbt.test", label: "Pathway · 20s access / 25s refresh", note: "Refresh token also expires — forces logout ~20–25s in" },
];

export function DemoAccountsPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-[#F5F8FA]"
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
          <FlaskConical className="h-4 w-4 text-sky-600" />
          Demo test accounts
        </span>
        <ChevronDown className={cn("h-4 w-4 text-text-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-border">
          <p className="text-xs text-text-muted pt-3">
            Password for all: <span className="font-mono font-semibold text-text-primary">password123</span>
          </p>
          <ul className="space-y-2.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <li key={acc.email} className="text-xs">
                <p className="font-mono font-semibold text-text-primary break-all">{acc.email}</p>
                <p className="text-text-muted mt-0.5">
                  {acc.label} — {acc.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
