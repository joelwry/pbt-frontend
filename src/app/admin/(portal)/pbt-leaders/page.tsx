import type { Metadata } from "next";
import { LeadersManagementView } from "@/features/admin-leaders/components/leaders-management-view";

export const metadata: Metadata = {
  title: "PBT Leaders Management | PBT Admin",
};

export default function AdminLeadersPage() {
  return <LeadersManagementView />;
}
