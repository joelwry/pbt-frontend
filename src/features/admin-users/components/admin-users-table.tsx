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
import { useDeleteAdminAccount } from "@/features/admin-users/hooks/use-admin-users";
import { useToast } from "@/providers/toast-provider";
import { accessScopeLabel } from "@/features/admin-users/utils";
import type { AdminAccount, AdminAccountStatus } from "@/features/admin-users/types";
import type { AdminRole } from "@/features/admin-auth/types";

const ROLE_VARIANT: Record<AdminRole, "navy" | "sky" | "outline"> = {
  "Super Admin": "navy",
  "Content Manager": "sky",
  "Community Moderator": "sky",
  "Support Staff": "outline",
};

const STATUS_VARIANT: Record<AdminAccountStatus, "success" | "slate"> = {
  Active: "success",
  Invited: "slate",
};

export function AdminUsersTable({ accounts }: { accounts: AdminAccount[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
            <th className="py-3 pr-4">Admin User</th>
            <th className="py-3 pr-4">Role</th>
            <th className="py-3 pr-4">Access Scope</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {accounts.map((account) => (
            <AdminAccountRow key={account.id} account={account} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminAccountRow({ account }: { account: AdminAccount }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteAccount, isPending } = useDeleteAdminAccount();
  const { toast } = useToast();
  const isSuperAdmin = account.role === "Super Admin";

  function handleDelete() {
    deleteAccount(account.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast({ variant: "success", title: "Admin account removed", description: `${account.fullName} no longer has access.` });
      },
    });
  }

  return (
    <tr>
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-orange-500 text-navy-950 text-xs font-bold flex items-center justify-center shrink-0">
            {account.initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-text-primary truncate">{account.fullName}</p>
            <p className="text-xs text-text-muted truncate">{account.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4">
        <Badge variant={ROLE_VARIANT[account.role]}>{account.role}</Badge>
      </td>
      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">{accessScopeLabel(account)}</td>
      <td className="py-3.5 pr-4">
        <Badge variant={STATUS_VARIANT[account.status]}>{account.status}</Badge>
      </td>
      <td className="py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/admin-users/${account.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-sky-600"
            aria-label={`View ${account.fullName}`}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/admin-users/${account.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-text-primary"
            aria-label={`Edit ${account.fullName}`}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <button
              onClick={() => !isSuperAdmin && setDeleteOpen(true)}
              disabled={isSuperAdmin}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#FEF2F2] text-text-muted hover:text-error disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label={`Remove ${account.fullName}`}
              title={isSuperAdmin ? "The last Super Admin can't be removed here" : undefined}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove {account.fullName}?</DialogTitle>
                <DialogDescription>
                  They&apos;ll immediately lose access to the admin portal. This can&apos;t be undone.
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
                  {isPending ? "Removing…" : "Remove Access"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
