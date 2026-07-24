import type { Metadata } from "next";
import { CalendarView } from "@/features/calendar/components/calendar-view";

export const metadata: Metadata = {
  title: "Calendar | Property Business Training",
};

export default function CalendarPage() {
  return <CalendarView />;
}
