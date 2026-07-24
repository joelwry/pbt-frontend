"use client";

import { useState } from "react";
import Link from "next/link";
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
import { useDeletePartner } from "@/features/admin-power-team/hooks/use-admin-power-team";
import { useToast } from "@/providers/toast-provider";
import type { AdminPartner } from "@/features/admin-power-team/types";

export function PartnersTable({ partners }: { partners: AdminPartner[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
            <th className="py-3 pr-4">Partner</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">Region</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {partners.map((partner) => (
            <PartnerRow key={partner.id} partner={partner} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PartnerRow({ partner }: { partner: AdminPartner }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deletePartner, isPending } = useDeletePartner();
  const { toast } = useToast();

  function handleDelete() {
    deletePartner(partner.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast({ variant: "success", title: "Partner removed", description: `${partner.name} has been removed.` });
      },
    });
  }

  return (
    <tr>
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {partner.initials}
          </div>
          <p className="font-semibold text-text-primary truncate">{partner.name}</p>
        </div>
      </td>
      <td className="py-3.5 pr-4">
        <Badge variant="outline">{partner.category}</Badge>
      </td>
      <td className="py-3.5 pr-4 text-text-secondary">{partner.region}</td>
      <td className="py-3.5 pr-4">
        <Badge variant={partner.status === "Verified" ? "success" : "orange"}>{partner.status}</Badge>
      </td>
      <td className="py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/power-team/${partner.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-sky-600"
            aria-label={`View ${partner.name}`}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/power-team/${partner.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-text-primary"
            aria-label={`Edit ${partner.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#FEF2F2] text-text-muted hover:text-error"
              aria-label={`Delete ${partner.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove {partner.name}?</DialogTitle>
                <DialogDescription>
                  They&apos;ll no longer appear in the member-facing Power Team directory. This can&apos;t be undone.
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
                  {isPending ? "Removing…" : "Remove Partner"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
