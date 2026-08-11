"use client";

import { useState } from "react";
import { Type, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import { useAdminSiteSettings, useUpdateSiteSettings } from "@/features/admin-site-settings/hooks/use-admin-site-settings";

/** Only ever mounted once `currentLabel` is real data (see the isLoading branch below), so seeding local edit state from a prop on mount is safe -- no effect-based re-sync needed. */
function TerminologyForm({ currentLabel }: { currentLabel: string }) {
  const { mutate, isPending } = useUpdateSiteSettings();
  const { toast } = useToast();
  const [workshopLabel, setWorkshopLabel] = useState(currentLabel);

  function handleSave() {
    if (!workshopLabel.trim()) {
      toast({ variant: "error", title: "Can't be empty", description: "Enter a label first." });
      return;
    }
    mutate(
      { workshopLabel: workshopLabel.trim() },
      {
        onSuccess: () => {
          toast({ variant: "success", title: "Terminology updated", description: "This now appears everywhere across the member portal." });
        },
        onError: () => {
          toast({ variant: "error", title: "Couldn't update terminology", description: "Please try again." });
        },
      }
    );
  }

  const isUnchanged = currentLabel === workshopLabel.trim();

  return (
    <div className="max-w-sm space-y-2">
      <Label htmlFor="workshop-label">&quot;Workshop&quot; is currently called</Label>
      <div className="flex items-center gap-3">
        <Input
          id="workshop-label"
          value={workshopLabel}
          onChange={(e) => setWorkshopLabel(e.target.value)}
          placeholder="Deal Clinic"
        />
        <Button onClick={handleSave} disabled={isPending || isUnchanged} className="shrink-0">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
      <p className="text-xs text-text-muted">
        {/* A space right after {expr} is silently dropped by JSX whenever the
            surrounding text node also spans a line break (as it does here,
            before the closing </p>) -- rendered as "Deal ClinicSchedule
            Preview" with no space. A single template literal sidesteps the
            multi-text-node whitespace trimming entirely. */}
        {`Used across the Dashboard, the enrolment page, and every plan page (e.g. "${workshopLabel || "Deal Clinic"} Schedule Preview").`}
      </p>
    </div>
  );
}

export function TerminologySettingsCard() {
  const { data, isLoading } = useAdminSiteSettings();

  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <Type className="h-4 w-4 text-sky-600" />
        <h3 className="font-display text-lg font-semibold text-text-primary">Terminology</h3>
      </div>
      <p className="text-sm text-text-muted mb-5">
        Site-wide wording the client may want to change without a redeploy. Updates take effect immediately for
        every member.
      </p>

      {isLoading || !data ? <Skeleton className="h-10 w-full max-w-sm" /> : <TerminologyForm currentLabel={data.workshopLabel} />}
    </Card>
  );
}
