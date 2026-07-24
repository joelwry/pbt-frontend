import type { Metadata } from "next";
import { PowerTeamView } from "@/features/power-team/components/power-team-view";

export const metadata: Metadata = {
  title: "Power Team | Property Business Training",
};

export default function PowerTeamPage() {
  return <PowerTeamView />;
}
