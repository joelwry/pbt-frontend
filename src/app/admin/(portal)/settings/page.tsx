import type { Metadata } from "next";
import { AdminSettingsView } from "@/features/admin-site-settings/components/admin-settings-view";

export const metadata: Metadata = {
  title: "Site Settings | PBT Admin",
};

export default function AdminSettingsPage() {
  return <AdminSettingsView />;
}
