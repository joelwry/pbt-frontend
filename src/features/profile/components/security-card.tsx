"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";
import { useChangePassword, PasswordError } from "@/features/profile/hooks/use-profile";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

const FIELDS = [
  { name: "currentPassword", label: "Current Password", autoComplete: "current-password" },
  { name: "newPassword", label: "New Password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm New Password", autoComplete: "new-password" },
] as const;

export function SecurityCard() {
  const { mutate, isPending } = useChangePassword();
  const { toast } = useToast();
  const [visible, setVisible] = useState<Record<(typeof FIELDS)[number]["name"], boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  function onSubmit(values: PasswordValues) {
    mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast({ variant: "success", title: "Password updated" });
          reset();
        },
        onError: (error) => {
          if (error instanceof PasswordError) {
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
      <div className="flex items-center gap-2 mb-1">
        <KeyRound className="h-4 w-4 text-sky-600" />
        <h3 className="font-display text-lg font-semibold text-text-primary">Security</h3>
      </div>
      <p className="text-sm text-text-muted mb-5">Change your password. You&apos;ll need your current password to confirm it&apos;s you.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {FIELDS.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <div className="relative">
              <Input
                id={field.name}
                type={visible[field.name] ? "text" : "password"}
                autoComplete={field.autoComplete}
                invalid={!!errors[field.name]}
                className="pr-11"
                {...register(field.name)}
              />
              <button
                type="button"
                onClick={() => setVisible((v) => ({ ...v, [field.name]: !v[field.name] }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                aria-label={visible[field.name] ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {visible[field.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors[field.name] && <p className="text-xs text-error">{errors[field.name]?.message}</p>}
          </div>
        ))}
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Updating…" : "Update Password"}
        </Button>
      </form>
    </Card>
  );
}
