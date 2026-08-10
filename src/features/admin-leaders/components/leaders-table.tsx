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
import { useDeleteLeader } from "@/features/admin-leaders/hooks/use-admin-leaders";
import { useToast } from "@/providers/toast-provider";
import { Avatar } from "@/components/shared/avatar";
import type { AdminLeader } from "@/features/admin-leaders/types";

export function LeadersTable({ leaders }: { leaders: AdminLeader[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
            <th className="py-3 pr-4">Leader</th>
            <th className="py-3 pr-4">Specialty</th>
            <th className="py-3 pr-4">Members Assigned</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {leaders.map((leader) => (
            <LeaderRow key={leader.id} leader={leader} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeaderRow({ leader }: { leader: AdminLeader }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteLeader, isPending } = useDeleteLeader();
  const { toast } = useToast();

  function handleDelete() {
    deleteLeader(leader.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast({ variant: "success", title: "Leader removed", description: `${leader.fullName} has been removed.` });
      },
    });
  }

  return (
    <tr>
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={leader.profileImageUrl}
            alt={leader.fullName}
            initials={leader.initials}
            className="h-9 w-9 rounded-full text-xs shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-text-primary truncate">{leader.fullName}</p>
            <p className="text-xs text-text-muted truncate">{leader.region}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4">
        <Badge variant="sky">{leader.specialty}</Badge>
      </td>
      <td className="py-3.5 pr-4 text-text-secondary">{leader.membersAssigned}</td>
      <td className="py-3.5 pr-4">
        <Badge variant={leader.status === "Active" ? "success" : "outline"}>{leader.status}</Badge>
      </td>
      <td className="py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/pbt-leaders/${leader.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-sky-600"
            aria-label={`View ${leader.fullName}`}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/pbt-leaders/${leader.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-text-primary"
            aria-label={`Edit ${leader.fullName}`}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#FEF2F2] text-text-muted hover:text-error"
              aria-label={`Delete ${leader.fullName}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove {leader.fullName}?</DialogTitle>
                <DialogDescription>
                  Their {leader.membersAssigned} assigned members will need reassigning to another Leader. This
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
                  {isPending ? "Removing…" : "Remove Leader"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
