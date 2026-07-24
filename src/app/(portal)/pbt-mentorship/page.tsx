import type { Metadata } from "next";
import { MentorshipView } from "@/features/mentorship/components/mentorship-view";

export const metadata: Metadata = {
  title: "PBT Mentorship | Property Business Training",
};

export default function PbtMentorshipPage() {
  return <MentorshipView />;
}
