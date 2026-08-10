import type { Metadata } from "next";
import { CommunityGuidelinesView } from "@/features/community/components/community-guidelines-view";

export const metadata: Metadata = {
  title: "Community Guidelines | Property Business Training",
};

export default function CommunityGuidelinesPage() {
  return <CommunityGuidelinesView />;
}
