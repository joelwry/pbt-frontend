import type { Metadata } from "next";
import { PowerTeamManagementView } from "@/features/admin-power-team/components/power-team-management-view";

export const metadata: Metadata = {
  title: "Power Team Management | PBT Admin",
};

export default function AdminPowerTeamPage() {
  return <PowerTeamManagementView />;
}
