import type { Metadata } from "next";
import { ResourcesView } from "@/features/resources/components/resources-view";

export const metadata: Metadata = {
  title: "Resources | Property Business Training",
};

export default function ResourcesPage() {
  return <ResourcesView />;
}
