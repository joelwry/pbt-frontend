"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useDeleteResource } from "@/features/admin-resources/hooks/use-admin-resources";
import { useToast } from "@/providers/toast-provider";
import type { AdminResource, AdminResourceCategory } from "@/features/admin-resources/types";

const CATEGORY_VARIANT: Record<AdminResourceCategory, "outline" | "sky" | "orange"> = {
  Template: "outline",
  Guide: "sky",
  Webinar: "orange",
  Toolkit: "sky",
};
const STATUS_VARIANT = { Published: "success" as const, Draft: "orange" as const };

export function ResourcesTable({ resources }: { resources: AdminResource[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
            <th className="py-3 pr-4">Resource</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">File Type</th>
            <th className="py-3 pr-4">Engagement</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {resources.map((resource) => (
            <ResourceRow key={resource.id} resource={resource} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResourceRow({ resource }: { resource: AdminResource }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteResource, isPending } = useDeleteResource();
  const { toast } = useToast();

  function handleDelete() {
    deleteResource(resource.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast({ variant: "success", title: "Resource deleted", description: `"${resource.title}" has been removed.` });
      },
    });
  }

  return (
    <tr>
      <td className="py-3.5 pr-4 font-semibold text-text-primary">{resource.title}</td>
      <td className="py-3.5 pr-4">
        <Badge variant={CATEGORY_VARIANT[resource.category]}>{resource.category}</Badge>
      </td>
      <td className="py-3.5 pr-4 text-text-secondary">{resource.fileType}</td>
      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">{resource.engagementLabel}</td>
      <td className="py-3.5 pr-4">
        <Badge variant={STATUS_VARIANT[resource.status]}>{resource.status}</Badge>
      </td>
      <td className="py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/resources/${resource.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-sky-600"
            aria-label={`View ${resource.title}`}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/resources/${resource.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-text-primary"
            aria-label={`Edit ${resource.title}`}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#FEF2F2] text-text-muted hover:text-error"
              aria-label={`Delete ${resource.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete &ldquo;{resource.title}&rdquo;?</DialogTitle>
                <DialogDescription>
                  This removes the resource from the library. Members won&apos;t be able to download it anymore. This
                  can&apos;t be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-3 mt-2">
                <DialogClose asChild>
                  <Button variant="secondary" className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant="danger" className="flex-1" disabled={isPending} onClick={handleDelete}>
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isPending ? "Deleting…" : "Delete Resource"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
