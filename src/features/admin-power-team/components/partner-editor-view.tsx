"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, ImageUp, Building2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import { useAdminPartner, useSavePartner } from "@/features/admin-power-team/hooks/use-admin-power-team";
import type { AdminPartner, AdminPartnerCategory, AdminPartnerStatus } from "@/features/admin-power-team/types";

const CATEGORIES: AdminPartnerCategory[] = ["Solicitors", "Mortgage Brokers", "Accountants", "Surveyors"];
const STATUSES: AdminPartnerStatus[] = ["Verified", "Pending Review", "Suspended"];

const editorSchema = z.object({
  name: z.string().min(2, "Enter the partner's company name"),
  category: z.enum(["Solicitors", "Mortgage Brokers", "Accountants", "Surveyors"]),
  region: z.string().min(2, "Add a region or city"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(6, "Enter a valid phone number"),
  bio: z.string().min(10, "Add a short description (at least 10 characters)"),
  status: z.enum(["Verified", "Pending Review", "Suspended"]),
});
type EditorFormValues = z.infer<typeof editorSchema>;

function defaultValues(): EditorFormValues {
  return { name: "", category: "Solicitors", region: "", email: "", phone: "", bio: "", status: "Pending Review" };
}

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

function buildPartner(values: EditorFormValues, isNew: boolean, partnerId: string): AdminPartner {
  return {
    id: isNew ? `pt_${Date.now()}` : partnerId,
    name: values.name,
    initials: initialsFor(values.name),
    category: values.category,
    region: values.region,
    status: values.status,
    email: values.email,
    phone: values.phone,
    bio: values.bio,
  };
}

export function PartnerEditorView({ partnerId }: { partnerId: string }) {
  const isNew = partnerId === "new";
  const router = useRouter();
  const { toast } = useToast();
  const { data: partner, isLoading, isError, refetch } = useAdminPartner(partnerId);
  const { mutate: savePartner, isPending } = useSavePartner();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditorFormValues>({ resolver: zodResolver(editorSchema), defaultValues: defaultValues() });

  useEffect(() => {
    if (partner) {
      reset({
        name: partner.name,
        category: partner.category,
        region: partner.region,
        email: partner.email,
        phone: partner.phone,
        bio: partner.bio,
        status: partner.status,
      });
    }
  }, [partner, reset]);

  function handleSave(values: EditorFormValues) {
    savePartner(buildPartner(values, isNew, partnerId), {
      onSuccess: () => {
        toast({ variant: "success", title: isNew ? "Partner added" : "Partner updated" });
        router.push("/admin/power-team");
      },
    });
  }

  if (!isNew && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-[var(--radius-card)]" />
          <Skeleton className="h-80 rounded-[var(--radius-card)]" />
        </div>
      </div>
    );
  }

  if (!isNew && (isError || !partner)) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? "Add Power Team Partner" : "Edit Power Team Partner"}
        description="Add or update a vetted Power Team partner."
        backHref="/admin/power-team"
        backLabel="Back to Power Team"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Partner Details</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" {...register("name")} invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  {...register("category")}
                  className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" placeholder="e.g. Leeds" {...register("region")} invalid={!!errors.region} />
                {errors.region && <p className="text-xs text-error">{errors.region.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
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
                rows={4}
                className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                {...register("bio")}
              />
              {errors.bio && <p className="text-xs text-error">{errors.bio.message}</p>}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="text-center">
            <div className="h-16 w-16 rounded-2xl bg-navy-900 text-white flex items-center justify-center mx-auto">
              <Building2 className="h-6 w-6" />
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-4">
              <ImageUp className="h-3.5 w-3.5" />
              Upload Logo
            </Button>
          </Card>

          <Card>
            <h3 className="font-display text-base font-semibold text-text-primary mb-4">Verification Status</h3>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <div className="space-y-3">
                  {STATUSES.map((option) => (
                    <label key={option} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="radio"
                        checked={field.value === option}
                        onChange={() => field.onChange(option)}
                        className="h-4 w-4 accent-sky-600"
                      />
                      <span className="text-sm text-text-secondary">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </Card>

          <Button className="w-full" disabled={isPending} onClick={handleSubmit(handleSave)}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isPending ? "Saving…" : "Save Partner"}
          </Button>
        </div>
      </div>
    </div>
  );
}
