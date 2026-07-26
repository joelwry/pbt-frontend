import type { Metadata } from "next";
import { RoadmapStructureView } from "@/features/admin-content/components/roadmap-structure-view";

export const metadata: Metadata = {
  title: "Roadmap Structure | PBT Admin",
};

export default function AdminRoadmapStructurePage() {
  return <RoadmapStructureView />;
}
