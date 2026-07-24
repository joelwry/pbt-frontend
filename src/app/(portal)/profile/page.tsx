import type { Metadata } from "next";
import { ProfileView } from "@/features/profile/components/profile-view";

export const metadata: Metadata = {
  title: "Profile | Property Business Training",
};

export default function ProfilePage() {
  return <ProfileView />;
}
