import type { Metadata } from "next";
import { SubscriptionsBillingView } from "@/features/admin-subscriptions/components/subscriptions-billing-view";

export const metadata: Metadata = {
  title: "Subscriptions & Billing | PBT Admin",
};

export default function AdminSubscriptionsPage() {
  return <SubscriptionsBillingView />;
}
