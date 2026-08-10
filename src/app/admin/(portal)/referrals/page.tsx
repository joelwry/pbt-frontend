import type { Metadata } from "next";
import { ReferralsManagementView } from "@/features/admin-referrals/components/referrals-management-view";

export const metadata: Metadata = {
  title: "Referrals | PBT Admin",
};

export default function AdminReferralsPage() {
  return <ReferralsManagementView />;
}
