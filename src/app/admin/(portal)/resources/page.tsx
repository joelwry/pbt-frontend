import type { Metadata } from "next";
import { ResourcesView } from "@/features/admin-resources/components/resources-view";

export const metadata: Metadata = {
  title: "Resource Management | PBT Admin",
};

export default function AdminResourcesPage() {
  return <ResourcesView />;
}
