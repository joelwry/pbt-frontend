"use client";

import { TierLearningView } from "@/features/learning/components/tier-learning-view";

export function MyLearningView() {
  return (
    <TierLearningView
      contentTier="Pathway"
      title="PBT Pathway"
      description="Your growth roadmap, at your own pace — no fixed end date."
      showContinueLearning
    />
  );
}
