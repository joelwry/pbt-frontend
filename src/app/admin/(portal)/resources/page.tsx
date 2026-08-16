import type { Metadata } from "next";
import { ResourcesView } from "@/features/admin-resources/components/resources-view";
import type { AdminResourceCategory } from "@/features/admin-resources/types";

export const metadata: Metadata = {
  title: "Resource Management | PBT Admin",
};

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <ResourcesView initialCategory={category as AdminResourceCategory | undefined} />;
}
