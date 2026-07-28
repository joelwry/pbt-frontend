import type { Metadata } from "next";
import { MasterplanLearningView } from "@/features/mentorship/components/masterplan-learning-view";

export const metadata: Metadata = {
  title: "PBT Masterplan Learning | Property Business Training",
};

export default function PbtMasterplanLearningPage() {
  return <MasterplanLearningView />;
}
