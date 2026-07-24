import type { Metadata } from "next";
import { EventsManagementView } from "@/features/admin-events/components/events-management-view";

export const metadata: Metadata = {
  title: "Event Management | PBT Admin",
};

export default function AdminEventsPage() {
  return <EventsManagementView />;
}
