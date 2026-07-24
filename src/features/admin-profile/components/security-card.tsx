"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";
import { useChangeAdminPassword, AdminPasswordError } from "@/features/admin-profile/hooks/use-admin-profile";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

export function SecurityCard() {
  const { mutate, isPending } = useChangeAdminPassword();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" } });

  function onSubmit(values: PasswordValues) {
    mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast({ variant: "success", title: "Password updated" });
          reset();
        },
        onError: (error) => {
          if (error instanceof AdminPasswordError) {
            setError("currentPassword", { message: error.message });
          } else {
            toast({ variant: "error", title: "Couldn't update password", description: "Please try again." });
          }
        },
      }
    );
  }

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Security</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" type="password" {...register("currentPassword")} invalid={!!errors.currentPassword} />
          {errors.currentPassword && <p className="text-xs text-error">{errors.currentPassword.message}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" {...register("newPassword")} invalid={!!errors.newPassword} />
            {errors.newPassword && <p className="text-xs text-error">{errors.newPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" {...register("confirmPassword")} invalid={!!errors.confirmPassword} />
            {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
          </div>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          {isPending ? "Updating…" : "Update Password"}
        </Button>
      </form>
    </Card>
  );
}
