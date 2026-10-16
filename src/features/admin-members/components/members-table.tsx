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
import { useDeleteMember } from "@/features/admin-members/hooks/use-admin-members";
import { useToast } from "@/providers/toast-provider";
import { TIER_LABEL, TIER_VARIANT } from "@/features/admin-members/tier-labels";
import type { AdminMemberListItem } from "@/features/admin-members/types";

const STATUS_VARIANT = {
  Active: "success" as const,
  "Payment Failed": "error" as const,
  Paused: "outline" as const,
};

export function MembersTable({ members }: { members: AdminMemberListItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
            <th className="py-3 pr-4">Member</th>
            <th className="py-3 pr-4">Tier</th>
            <th className="py-3 pr-4">Joined</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Contract</th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {members.map((member) => (
            <MemberRow key={member.id} member={member} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MemberRow({ member }: { member: AdminMemberListItem }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteMember, isPending } = useDeleteMember();
  const { toast } = useToast();

  function handleDelete() {
    deleteMember(member.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast({ variant: "success", title: "Member deleted", description: `${member.fullName} has been removed.` });
      },
      onError: () => {
        toast({ variant: "error", title: "Couldn't delete member", description: "Please try again." });
      },
    });
  }

  return (
    <tr>
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {member.initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-text-primary truncate">{member.fullName}</p>
            <p className="text-xs text-text-muted truncate">{member.clientId}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4">
        <Badge variant={TIER_VARIANT[member.tier]}>{TIER_LABEL[member.tier]}</Badge>
      </td>
      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">{member.joinedLabel}</td>
      <td className="py-3.5 pr-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={STATUS_VARIANT[member.status]}>{member.status}</Badge>
          {member.setupPending && <Badge variant="warning">Setup pending</Badge>}
        </div>
      </td>
      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">{member.contractLabel}</td>
      <td className="py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/members/${member.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-sky-600"
            aria-label={`View ${member.fullName}`}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/members/${member.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-text-primary"
            aria-label={`Edit ${member.fullName}`}
          >
            <Pencil className="h-4 w-4" />
          </Link>

          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete {member.fullName}?</DialogTitle>
                <DialogDescription>
                  This permanently removes their member record, including learning progress and billing history.
                  This can&apos;t be undone.
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
                  {isPending ? "Deleting…" : "Delete Member"}
                </Button>
              </div>
            </DialogContent>
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#FEF2F2] text-text-muted hover:text-error"
              aria-label={`Delete ${member.fullName}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
