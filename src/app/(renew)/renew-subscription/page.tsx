import type { Metadata } from "next";
import { RenewSubscriptionView } from "@/features/renew-subscription/components/renew-subscription-view";

export const metadata: Metadata = {
  title: "Renew Subscription | Property Business Training",
};

export default function RenewSubscriptionPage() {
  return <RenewSubscriptionView />;
}
