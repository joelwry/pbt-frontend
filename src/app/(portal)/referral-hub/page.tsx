import type { Metadata } from "next";
import { ReferralHubView } from "@/features/referral-hub/components/referral-hub-view";

export const metadata: Metadata = {
  title: "Referral Hub | Property Business Training",
};

export default function ReferralHubPage() {
  return <ReferralHubView />;
}
