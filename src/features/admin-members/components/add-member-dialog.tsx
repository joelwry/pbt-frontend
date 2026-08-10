"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/providers/toast-provider";
import { useState } from "react";
import { useCreateMember } from "@/features/admin-members/hooks/use-admin-members";

const addMemberSchema = z.object({
  fullName: z.string().min(2, "Enter the member's full name"),
  email: z.string().email("Enter a valid email address"),
  tier: z.enum(["Pathway", "Plus", "Mentorship"]),
});
type AddMemberValues = z.infer<typeof addMemberSchema>;

const TIER_OPTIONS = ["Pathway", "Plus", "Mentorship"] as const;
const TIER_OPTION_LABEL: Record<(typeof TIER_OPTIONS)[number], string> = {
  Pathway: "PBT Pathway",
  Plus: "PBT Plus",
  Mentorship: "PBT Masterplan Programme",
};

export function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutate: createMember, isPending } = useCreateMember();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddMemberValues>({ resolver: zodResolver(addMemberSchema), defaultValues: { tier: "Pathway" } });

  function onSubmit(values: AddMemberValues) {
    createMember(values, {
      onSuccess: () => {
        reset();
        setOpen(false);
        toast({
          variant: "success",
          title: "Member added",
          description: `${values.fullName} will receive an email to set up their account.`,
        });
      },
      onError: () => {
        toast({ variant: "error", title: "Couldn't add member", description: "That email may already be in use." });
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new member</DialogTitle>
          <DialogDescription>They&apos;ll receive a welcome email with login instructions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...register("fullName")} invalid={!!errors.fullName} />
            {errors.fullName && <p className="text-xs text-error">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register("email")} invalid={!!errors.email} />
            {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier">Membership Tier</Label>
            <Controller
              control={control}
              name="tier"
              render={({ field }) => (
                <select
                  id="tier"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {TIER_OPTIONS.map((tier) => (
                    <option key={tier} value={tier}>
                      {TIER_OPTION_LABEL[tier]}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {isPending ? "Adding…" : "Add Member"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
