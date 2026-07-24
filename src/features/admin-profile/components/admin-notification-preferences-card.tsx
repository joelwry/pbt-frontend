"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useUpdateAdminNotificationPreference } from "@/features/admin-profile/hooks/use-admin-profile";
import type { AdminNotificationPreferences } from "@/features/admin-profile/types";

const PREFERENCE_LABELS: { key: keyof AdminNotificationPreferences; label: string }[] = [
  { key: "flaggedContentAlerts", label: "Flagged content alerts" },
  { key: "failedPaymentAlerts", label: "Failed payment alerts" },
  { key: "weeklySummaryEmail", label: "Weekly summary email" },
];

export function AdminNotificationPreferencesCard({ notifications }: { notifications: AdminNotificationPreferences }) {
  const { mutate } = useUpdateAdminNotificationPreference();

  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-4">Notification Preferences</h3>
      <ul className="space-y-4">
        {PREFERENCE_LABELS.map((pref) => (
          <li key={pref.key} className="flex items-center justify-between gap-3">
            <span className="text-sm text-text-secondary">{pref.label}</span>
            <Switch checked={notifications[pref.key]} onCheckedChange={(checked) => mutate({ key: pref.key, value: checked })} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
