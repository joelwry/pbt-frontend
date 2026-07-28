"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/providers/toast-provider";
import { useUpdateMember } from "@/features/admin-members/hooks/use-admin-members";
import { adminLeadersService } from "@/features/admin-leaders/services/admin-leaders.service";
import type { AdminMemberDetail } from "@/features/admin-members/types";

const editMemberSchema = z.object({
  fullName: z.string().min(2, "Enter the member's full name"),
  phone: z.string(),
  location: z.string(),
  assignedLeaderId: z.string(),
});
type EditMemberValues = z.infer<typeof editMemberSchema>;

export function EditMemberDialog({
  member,
  open,
  onOpenChange,
}: {
  member: AdminMemberDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { mutate: updateMember, isPending } = useUpdateMember();
  const { data: leadersPage } = useQuery({
    queryKey: ["admin", "leaders", "list", "All", "", 1, "edit-member-dropdown"],
    queryFn: () => adminLeadersService.getLeadersPage({ region: "All", search: "", page: 1, limit: 100 }),
  });
  const activeLeaders = (leadersPage?.items ?? []).filter((l) => l.status === "Active");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditMemberValues>({ resolver: zodResolver(editMemberSchema) });

  useEffect(() => {
    if (open) {
      reset({
        fullName: member.fullName,
        phone: member.phone,
        location: member.location,
        assignedLeaderId: member.assignedLeaderId ?? "",
      });
    }
  }, [open, member, reset]);

  function onSubmit(values: EditMemberValues) {
    updateMember(
      { id: member.id, ...values, assignedLeaderId: values.assignedLeaderId || null },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast({ variant: "success", title: "Member updated", description: `${values.fullName}'s details have been saved.` });
        },
        onError: () => toast({ variant: "error", title: "Couldn't update member", description: "Please try again." }),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit member details</DialogTitle>
          <DialogDescription>Update {member.fullName}&apos;s account information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-fullName">Full Name</Label>
            <Input id="edit-fullName" {...register("fullName")} invalid={!!errors.fullName} />
            {errors.fullName && <p className="text-xs text-error">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input id="edit-phone" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-location">Location</Label>
            <Input id="edit-location" {...register("location")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-leader">Assigned Leader</Label>
            <select
              id="edit-leader"
              {...register("assignedLeaderId")}
              className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <option value="">Not assigned</option>
              {activeLeaders.map((leader) => (
                <option key={leader.id} value={leader.id}>
                  {leader.fullName}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isPending ? "Saving…" : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
