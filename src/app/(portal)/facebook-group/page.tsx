import type { Metadata } from "next";
import { FacebookGroupView } from "@/features/facebook-group/components/facebook-group-view";

export const metadata: Metadata = {
  title: "Facebook Group | Property Business Training",
};

export default function FacebookGroupPage() {
  return <FacebookGroupView />;
}
