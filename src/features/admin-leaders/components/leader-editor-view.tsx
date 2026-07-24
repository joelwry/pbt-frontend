"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, ImageUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import { useAdminLeader, useSaveLeader } from "@/features/admin-leaders/hooks/use-admin-leaders";
import type { AdminLeader, AdminLeaderRegion, AdminLeaderStatus } from "@/features/admin-leaders/types";

const REGIONS: AdminLeaderRegion[] = ["North West", "Midlands", "London & South East", "Scotland"];

const editorSchema = z.object({
  fullName: z.string().min(2, "Enter the leader's full name"),
  region: z.enum(["North West", "Midlands", "London & South East", "Scotland"]),
  specialty: z.string().min(2, "Add a specialty"),
  email: z.string().email("Enter a valid email address"),
  bio: z.string().min(10, "Add a short bio (at least 10 characters)"),
  status: z.enum(["Active", "Inactive"]),
});
type EditorFormValues = z.infer<typeof editorSchema>;

function defaultValues(): EditorFormValues {
  return { fullName: "", region: "North West", specialty: "", email: "", bio: "", status: "Active" };
}

function initialsFor(fullName: string) {
  return (
    fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "PL"
  );
}

function buildLeader(values: EditorFormValues, isNew: boolean, leaderId: string, existingAssigned: number): AdminLeader {
  return {
    id: isNew ? `ldr_${Date.now()}` : leaderId,
    fullName: values.fullName,
    initials: initialsFor(values.fullName),
    region: values.region as AdminLeaderRegion,
    specialty: values.specialty,
    email: values.email,
    bio: values.bio,
    status: values.status as AdminLeaderStatus,
    membersAssigned: existingAssigned,
  };
}

export function LeaderEditorView({ leaderId }: { leaderId: string }) {
  const isNew = leaderId === "new";
  const router = useRouter();
  const { toast } = useToast();
  const { data: leader, isLoading, isError, refetch } = useAdminLeader(leaderId);
  const { mutate: saveLeader, isPending } = useSaveLeader();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditorFormValues>({ resolver: zodResolver(editorSchema), defaultValues: defaultValues() });

  const watchedName = watch("fullName");

  useEffect(() => {
    if (leader) {
      reset({
        fullName: leader.fullName,
        region: leader.region,
        specialty: leader.specialty,
        email: leader.email,
        bio: leader.bio,
        status: leader.status,
      });
    }
  }, [leader, reset]);

  function handleSave(values: EditorFormValues) {
    saveLeader(buildLeader(values, isNew, leaderId, leader?.membersAssigned ?? 0), {
      onSuccess: () => {
        toast({ variant: "success", title: isNew ? "Leader added" : "Leader updated" });
        router.push("/admin/pbt-leaders");
      },
    });
  }

  if (!isNew && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-[var(--radius-card)]" />
          <Skeleton className="h-64 rounded-[var(--radius-card)]" />
        </div>
      </div>
    );
  }

  if (!isNew && (isError || !leader)) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? "Add PBT Leader" : "Edit PBT Leader"}
        description="Create or update a PBT Leader profile."
        backHref="/admin/pbt-leaders"
        backLabel="Back to PBT Leaders"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Leader Profile</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName")} invalid={!!errors.fullName} />
              {errors.fullName && <p className="text-xs text-error">{errors.fullName.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <select
                  id="region"
                  {...register("region")}
                  className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input id="specialty" placeholder="e.g. HMO & Conversions" {...register("specialty")} invalid={!!errors.specialty} />
                {errors.specialty && <p className="text-xs text-error">{errors.specialty.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
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
            <div className="h-20 w-20 rounded-full bg-orange-500 text-white text-2xl font-bold flex items-center justify-center mx-auto">
              {initialsFor(watchedName || leader?.fullName || "PL")}
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-4">
              <ImageUp className="h-3.5 w-3.5" />
              Upload Photo
            </Button>
          </Card>

          <Card>
            <h3 className="font-display text-base font-semibold text-text-primary mb-4">Status</h3>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <div className="space-y-3">
                  {(["Active", "Inactive"] as const).map((option) => (
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
            {isPending ? "Saving…" : "Save Leader"}
          </Button>
        </div>
      </div>
    </div>
  );
}
