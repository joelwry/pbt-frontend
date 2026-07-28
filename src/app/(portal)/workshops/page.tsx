import type { Metadata } from "next";
import { WorkshopsView } from "@/features/events/components/workshops-view";

export const metadata: Metadata = {
  title: "Workshops | Property Business Training",
};

export default function WorkshopsPage() {
  return <WorkshopsView />;
}
