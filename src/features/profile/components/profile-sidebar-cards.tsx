"use client";

import { ImageUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MEMBERSHIP_BADGE } from "@/features/session/membership-badge";
import { useUpdateNotificationPreference } from "@/features/profile/hooks/use-profile";
import type { NotificationPreferences } from "@/features/profile/types";
import type { CurrentMember } from "@/features/session/types";

export function ProfileSummaryCard({ member }: { member: CurrentMember }) {
  const badge = MEMBERSHIP_BADGE[member.membershipTier];

  return (
    <Card className="text-center">
      <div className="h-20 w-20 rounded-full bg-orange-500 text-white text-2xl font-bold flex items-center justify-center mx-auto">
        {member.initials}
      </div>
      <p className="font-display text-base font-semibold text-text-primary mt-3">{member.fullName}</p>
      <div className="mt-1.5 flex items-center justify-center">
        <Badge variant="orange">{badge.label}</Badge>
      </div>
      <p className="text-xs text-text-muted mt-2">Client ID: {member.clientId}</p>
      <Button variant="secondary" size="sm" className="w-full mt-4">
        <ImageUp className="h-3.5 w-3.5" />
        Change Photo
      </Button>
    </Card>
  );
}

const PREFERENCE_LABELS: { key: keyof NotificationPreferences; label: string }[] = [
  { key: "communityReplies", label: "Community replies" },
  { key: "eventReminders", label: "Event reminders" },
  { key: "newModuleReleases", label: "New module releases" },
  { key: "marketingUpdates", label: "Marketing updates" },
];

export function NotificationPreferencesCard({ notifications }: { notifications: NotificationPreferences }) {
  const { mutate } = useUpdateNotificationPreference();

  return (
    <Card>
      <h3 className="font-display text-base font-semibold text-text-primary mb-4">Notification Preferences</h3>
      <ul className="space-y-4">
        {PREFERENCE_LABELS.map((pref) => (
          <li key={pref.key} className="flex items-center justify-between gap-3">
            <span className="text-sm text-text-secondary">{pref.label}</span>
            <Switch
              checked={notifications[pref.key]}
              onCheckedChange={(checked) => mutate({ key: pref.key, value: checked })}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
