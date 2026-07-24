import type { Metadata } from "next";
import { ContentManagementView } from "@/features/admin-content/components/content-management-view";

export const metadata: Metadata = {
  title: "Content Management | PBT Admin",
};

export default function AdminContentPage() {
  return <ContentManagementView />;
}
