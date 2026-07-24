import type { Metadata } from "next";
import { AnalyticsReportsView } from "@/features/admin-analytics/components/analytics-reports-view";

export const metadata: Metadata = {
  title: "Analytics & Reports | PBT Admin",
};

export default function AdminAnalyticsPage() {
  return <AnalyticsReportsView />;
}
