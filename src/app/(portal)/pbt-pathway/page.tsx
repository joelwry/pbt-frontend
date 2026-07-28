import type { Metadata } from "next";
import { MyLearningView } from "@/features/learning/components/my-learning-view";

export const metadata: Metadata = {
  title: "PBT Pathway | Property Business Training",
};

export default function PbtPathwayPage() {
  return <MyLearningView />;
}
