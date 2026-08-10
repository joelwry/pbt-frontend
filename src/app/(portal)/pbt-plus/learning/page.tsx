import type { Metadata } from "next";
import { PlusLearningView } from "@/features/plus/components/plus-learning-view";

export const metadata: Metadata = {
  title: "PBT Plus Learning | Property Business Training",
};

export default function PbtPlusLearningPage() {
  return <PlusLearningView />;
}
