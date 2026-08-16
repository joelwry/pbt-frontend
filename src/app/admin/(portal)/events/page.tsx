import type { Metadata } from "next";
import { EventsManagementView } from "@/features/admin-events/components/events-management-view";
import type { EventFilterTab } from "@/features/admin-events/types";

export const metadata: Metadata = {
  title: "Event Management | PBT Admin",
};

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <EventsManagementView initialTab={tab as EventFilterTab | undefined} />;
}
