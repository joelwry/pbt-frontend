"use client";

import { useEffect, useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import { Avatar } from "@/components/shared/avatar";
import { useAdminLeader, useSaveLeader, useUploadLeaderPhoto } from "@/features/admin-leaders/hooks/use-admin-leaders";
import type { AdminLeader, AdminLeaderRegion, AdminLeaderStatus } from "@/features/admin-leaders/types";

const REGIONS: AdminLeaderRegion[] = ["North West", "Midlands", "London & South East", "Scotland"];

const editorSchema = z.object({
  fullName: z.string().min(2, "Enter the leader's full name"),
  region: z.enum(["North West", "Midlands", "London & South East", "Scotland"]),
  specialty: z.string().min(2, "Add a specialty"),
  specialtiesInput: z.string(),
  location: z.string().min(1, "Add a city or sub-region"),
  yearsActive: z.string().min(1, "Enter years active").refine((v) => Number(v) >= 0, "Must be 0 or greater"),
  email: z.string().email("Enter a valid email address"),
  bio: z.string().min(10, "Add a short bio (at least 10 characters)"),
  status: z.enum(["Active", "Inactive"]),
  isTopMentor: z.boolean(),
});
type EditorFormValues = z.infer<typeof editorSchema>;

function defaultValues(): EditorFormValues {
  return {
    fullName: "",
    region: "North West",
    specialty: "",
    specialtiesInput: "",
    location: "",
    yearsActive: "0",
    email: "",
    bio: "",
    status: "Active",
    isTopMentor: false,
  };
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

function buildLeader(
  values: EditorFormValues,
  isNew: boolean,
  leaderId: string,
  existingAssigned: number,
  existingPhotoUrl: string
): AdminLeader {
  return {
    id: isNew ? "" : leaderId,
    fullName: values.fullName,
    initials: initialsFor(values.fullName),
    region: values.region as AdminLeaderRegion,
    specialty: values.specialty,
    specialties: values.specialtiesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    email: values.email,
    bio: values.bio,
    status: values.status as AdminLeaderStatus,
    membersAssigned: existingAssigned,
    isTopMentor: values.isTopMentor,
    location: values.location,
    yearsActive: Number(values.yearsActive),
    profileImageUrl: existingPhotoUrl,
  };
}

export function LeaderEditorView({ leaderId }: { leaderId: string }) {
  const isNew = leaderId === "new";
  const router = useRouter();
  const { toast } = useToast();
  const { data: leader, isLoading, isError, refetch } = useAdminLeader(leaderId);
  const { mutate: saveLeader, isPending } = useSaveLeader();
  const { mutateAsync: uploadPhoto } = useUploadLeaderPhoto();
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
        specialtiesInput: leader.specialties.join(", "),
        location: leader.location,
        yearsActive: String(leader.yearsActive),
        email: leader.email,
        bio: leader.bio,
        status: leader.status,
        isTopMentor: leader.isTopMentor ?? false,
      });
    }
  }, [leader, reset]);

  function handlePhotoSelected(file: File) {
    setPendingPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function afterSave(saved: AdminLeader) {
    if (pendingPhoto) {
      try {
        await uploadPhoto({ leaderId: saved.id, file: pendingPhoto });
      } catch {
        toast({ variant: "error", title: "Leader saved, but the photo upload failed", description: "You can try uploading again from Edit Leader." });
      }
    }
  }

  function handleSave(values: EditorFormValues) {
    saveLeader(buildLeader(values, isNew, leaderId, leader?.membersAssigned ?? 0, leader?.profileImageUrl ?? ""), {
      onSuccess: async (saved) => {
        await afterSave(saved);
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

  const avatarUrl = photoPreview ?? (leader?.profileImageUrl || undefined);

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
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Greater Manchester" {...register("location")} invalid={!!errors.location} />
                {errors.location && <p className="text-xs text-error">{errors.location.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input id="specialty" placeholder="e.g. HMO & Conversions" {...register("specialty")} invalid={!!errors.specialty} />
                {errors.specialty && <p className="text-xs text-error">{errors.specialty.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsActive">Years Active</Label>
                <Input id="yearsActive" type="number" min={0} {...register("yearsActive")} invalid={!!errors.yearsActive} />
                {errors.yearsActive && <p className="text-xs text-error">{errors.yearsActive.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialtiesInput">Specialties</Label>
              <Input id="specialtiesInput" placeholder="Comma-separated, e.g. BRRR Strategy, HMO Conversions, Refinancing" {...register("specialtiesInput")} />
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

            <Controller
              control={control}
              name="isTopMentor"
              render={({ field }) => (
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  <span className="text-sm text-text-secondary">Top Mentor</span>
                </label>
              )}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="text-center">
            <Avatar
              src={avatarUrl}
              alt={watchedName || "Leader"}
              initials={initialsFor(watchedName || leader?.fullName || "PL")}
              className="h-20 w-20 rounded-full text-2xl mx-auto"
            />
            <Button variant="secondary" size="sm" className="w-full mt-4" asChild>
              <label className="cursor-pointer">
                <ImageUp className="h-3.5 w-3.5" />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && handlePhotoSelected(e.target.files[0])}
                />
              </label>
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
