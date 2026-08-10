import type { Metadata } from "next";
import { WorkshopsView } from "@/features/events/components/workshops-view";

// Static title -- the in-page heading (workshops-view.tsx) is the one that
// actually reflects an admin's current terminology setting live; this is
// just the browser tab title and isn't worth a server-side fetch for.
export const metadata: Metadata = {
  title: "Deal Clinic | Property Business Training",
};

export default function WorkshopsPage() {
  return <WorkshopsView />;
}
