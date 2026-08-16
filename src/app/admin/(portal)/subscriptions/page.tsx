import type { Metadata } from "next";
import { SubscriptionsBillingView } from "@/features/admin-subscriptions/components/subscriptions-billing-view";
import type { InvoiceStatus } from "@/features/admin-subscriptions/types";

export const metadata: Metadata = {
  title: "Subscriptions & Billing | PBT Admin",
};

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <SubscriptionsBillingView initialStatus={status as InvoiceStatus | undefined} />;
}
