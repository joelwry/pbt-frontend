"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateAdminProfileDetails } from "@/features/admin-profile/hooks/use-admin-profile";
import type { AdminProfileDetails } from "@/features/admin-profile/types";

const detailsSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a valid phone number"),
});
type DetailsValues = z.infer<typeof detailsSchema>;

export function AdminPersonalInformationForm({ details }: { details: AdminProfileDetails }) {
  const { mutate, isPending, isSuccess, reset: resetMutation } = useUpdateAdminProfileDetails();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<DetailsValues>({ resolver: zodResolver(detailsSchema), defaultValues: details });

  useEffect(() => {
    reset(details);
  }, [details, reset]);

  function onSubmit(values: DetailsValues) {
    mutate(values);
  }

  function handleCancel() {
    reset(details);
    resetMutation();
  }

  return (
    <Card>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Personal Information</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" {...register("phone")} invalid={!!errors.phone} />
            {errors.phone && <p className="text-xs text-error">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isPending || !isDirty}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {isPending ? "Saving…" : isSuccess && !isDirty ? "Saved" : "Save Changes"}
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={isPending || !isDirty}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
