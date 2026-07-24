import type { Metadata } from "next";
import { MembersView } from "@/features/admin-members/components/members-view";

export const metadata: Metadata = {
  title: "Member Management | PBT Admin",
};

export default function AdminMembersPage() {
  return <MembersView />;
}
