import type { Metadata } from "next";
import { SubscriptionView } from "@/features/subscription/components/subscription-view";

export const metadata: Metadata = {
  title: "My Subscription | Property Business Training",
};

export default function MySubscriptionPage() {
  return <SubscriptionView />;
}
