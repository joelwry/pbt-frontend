import type { Metadata } from "next";
import { MyLearningView } from "@/features/learning/components/my-learning-view";

export const metadata: Metadata = {
  title: "My Learning | Property Business Training",
};

export default function MyLearningPage() {
  return <MyLearningView />;
}
