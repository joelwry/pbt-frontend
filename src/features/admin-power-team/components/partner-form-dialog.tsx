"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Plus } from "lucide-react";
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
import { useSavePartner } from "@/features/admin-power-team/hooks/use-admin-power-team";
import type { AdminPartner, AdminPartnerCategory } from "@/features/admin-power-team/types";

const CATEGORIES: AdminPartnerCategory[] = ["Solicitors", "Mortgage Brokers", "Accountants", "Surveyors"];

const schema = z.object({
  name: z.string().min(2, "Enter the partner's name"),
  category: z.enum(["Solicitors", "Mortgage Brokers", "Accountants", "Surveyors"]),
  region: z.string().min(2, "Add a region or city"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a valid phone number"),
  bio: z.string().min(10, "Add a short description (at least 10 characters)"),
});
type FormValues = z.infer<typeof schema>;

function initialsFor(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "PT"
  );
}

function buildPartnerInput(values: FormValues, existingId: string | undefined, existingStatus: AdminPartner["status"] | undefined): AdminPartner {
  return {
    id: existingId ?? `pt_${Date.now()}`,
    name: values.name,
    initials: initialsFor(values.name),
    category: values.category,
    region: values.region,
    status: existingStatus ?? "Pending Review",
    email: values.email,
    phone: values.phone,
    bio: values.bio,
  };
}

export function PartnerFormDialog({ partner, trigger }: { partner?: AdminPartner; trigger: React.ReactNode }) {
  const isEdit = Boolean(partner);
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useSavePartner();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: partner
      ? { name: partner.name, category: partner.category, region: partner.region, email: partner.email, phone: partner.phone, bio: partner.bio }
      : { name: "", category: "Solicitors", region: "", email: "", phone: "", bio: "" },
  });

  useEffect(() => {
    if (open && partner) {
      reset({ name: partner.name, category: partner.category, region: partner.region, email: partner.email, phone: partner.phone, bio: partner.bio });
    }
  }, [open, partner, reset]);

  function onSubmit(values: FormValues) {
    const input = buildPartnerInput(values, partner?.id, partner?.status);
    mutate(input, {
      onSuccess: () => {
        setOpen(false);
        toast({
          variant: "success",
          title: isEdit ? "Partner updated" : "Partner added",
          description: isEdit ? undefined : "New partners start as Pending Review until verified.",
        });
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit partner" : "Add a Power Team partner"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update this partner's details." : "New partners are added as Pending Review until verified."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input id="name" {...register("name")} invalid={!!errors.name} />
            {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <select
                    id="category"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region / City</Label>
              <Input id="region" {...register("region")} invalid={!!errors.region} />
              {errors.region && <p className="text-xs text-error">{errors.region.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} invalid={!!errors.phone} />
              {errors.phone && <p className="text-xs text-error">{errors.phone.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Description</Label>
            <textarea
              id="bio"
              rows={3}
              className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              {...register("bio")}
            />
            {errors.bio && <p className="text-xs text-error">{errors.bio.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Partner"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
