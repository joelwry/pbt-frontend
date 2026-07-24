import type { Metadata } from "next";
import { LeadersView } from "@/features/leaders/components/leaders-view";

export const metadata: Metadata = {
  title: "PBT Leaders | Property Business Training",
};

export default function PbtLeadersPage() {
  return <LeadersView />;
}
