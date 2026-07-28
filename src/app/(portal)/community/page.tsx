import type { Metadata } from "next";
import { CommunityView } from "@/features/community/components/community-view";

export const metadata: Metadata = {
  title: "Community Group | Property Business Training",
};

export default function CommunityPage() {
  return <CommunityView />;
}
