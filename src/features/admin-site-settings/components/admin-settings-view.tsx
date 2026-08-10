import { PageHeader } from "@/components/shared/page-header";
import { TerminologySettingsCard } from "@/features/admin-site-settings/components/terminology-settings-card";

export function AdminSettingsView() {
  return (
    <div className="space-y-6">
      <PageHeader title="Site Settings" description="Global configuration for the member portal." />
      <TerminologySettingsCard />
    </div>
  );
}
