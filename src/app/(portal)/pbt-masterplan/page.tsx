import type { Metadata } from "next";
import { MentorshipView } from "@/features/mentorship/components/mentorship-view";

export const metadata: Metadata = {
  title: "PBT Masterplan Programme | Property Business Training",
};

export default function PbtMasterplanPage() {
  return <MentorshipView />;
}
