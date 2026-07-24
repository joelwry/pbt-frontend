import type { Metadata } from "next";
import { PlusView } from "@/features/plus/components/plus-view";

export const metadata: Metadata = {
  title: "PBT Plus | Property Business Training",
};

export default function PbtPlusPage() {
  return <PlusView />;
}
