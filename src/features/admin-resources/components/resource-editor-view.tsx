"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, FileEdit } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileUploadDropzone } from "@/components/shared/file-upload-dropzone";
import { useToast } from "@/providers/toast-provider";
import { useAdminResource, useSaveResource, useUploadResourceFile } from "@/features/admin-resources/hooks/use-admin-resources";
import type { AdminResource, AdminResourceCategory, AdminResourceFileType, ResourceVisibility } from "@/features/admin-resources/types";

const CATEGORIES: AdminResourceCategory[] = ["Template", "Guide", "Webinar", "Toolkit"];
const FILE_TYPES: AdminResourceFileType[] = ["XLSX", "PDF", "MP4", "DOCX", "ZIP"];

const editorSchema = z.object({
  title: z.string().min(3, "Give the resource a title"),
  category: z.enum(["Template", "Guide", "Webinar", "Toolkit"]),
  fileType: z.enum(["XLSX", "PDF", "MP4", "DOCX", "ZIP"]),
  metaLabel: z.string().min(1, "Add a short label (e.g. \"12 pages\", \"58 min\")"),
  description: z.string().min(10, "Add a short description (at least 10 characters)"),
  visibility: z.enum(["all", "plus-mentorship", "mentorship"]),
  status: z.enum(["Published", "Draft"]),
});
type EditorFormValues = z.infer<typeof editorSchema>;

function defaultValues(): EditorFormValues {
  return { title: "", category: "Template", fileType: "PDF", metaLabel: "", description: "", visibility: "all", status: "Draft" };
}

function buildResource(values: EditorFormValues, isNew: boolean, resourceId: string, existingEngagement?: string, existingFileUrl?: string): AdminResource {
  return {
    id: isNew ? "" : resourceId,
    title: values.title,
    category: values.category,
    fileType: values.fileType,
    engagementLabel: existingEngagement ?? "New",
    status: values.status,
    description: values.description,
    visibility: values.visibility as ResourceVisibility,
    metaLabel: values.metaLabel,
    fileUrl: existingFileUrl ?? "",
  };
}

export function ResourceEditorView({ resourceId }: { resourceId: string }) {
  const isNew = resourceId === "new";
  const router = useRouter();
  const { toast } = useToast();
  const { data: resource, isLoading, isError, refetch } = useAdminResource(resourceId);
  const { mutate: saveResource, isPending } = useSaveResource();
  const { mutateAsync: uploadFile } = useUploadResourceFile();
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditorFormValues>({ resolver: zodResolver(editorSchema), defaultValues: defaultValues() });

  useEffect(() => {
    if (resource) {
      reset({
        title: resource.title,
        category: resource.category,
        fileType: resource.fileType,
        metaLabel: resource.metaLabel,
        description: resource.description,
        visibility: resource.visibility,
        status: resource.status,
      });
    }
  }, [resource, reset]);

  async function afterSave(saved: AdminResource) {
    if (pendingFile) {
      try {
        await uploadFile({ resourceId: saved.id, file: pendingFile });
      } catch {
        toast({ variant: "error", title: "Resource saved, but the file upload failed", description: "You can try uploading again from Edit Resource." });
      }
    }
  }

  function handleSave(values: EditorFormValues, forcedStatus: "Published" | "Draft") {
    saveResource(buildResource({ ...values, status: forcedStatus }, isNew, resourceId, resource?.engagementLabel, resource?.fileUrl), {
      onSuccess: async (saved) => {
        await afterSave(saved);
        toast({
          variant: "success",
          title: isNew ? "Resource created" : "Resource updated",
          description: forcedStatus === "Published" ? "It's live in the resource library." : "Saved as a draft.",
        });
        router.push("/admin/resources");
      },
    });
  }

  if (!isNew && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2 rounded-[var(--radius-card)]" />
          <Skeleton className="h-96 rounded-[var(--radius-card)]" />
        </div>
      </div>
    );
  }

  if (!isNew && (isError || !resource)) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? "Add Resource" : "Edit Resource"}
        description="Add or update a downloadable resource."
        backHref="/admin/resources"
        backLabel="Back to Resources"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Resource Details</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Resource Title</Label>
              <Input id="title" {...register("title")} invalid={!!errors.title} />
              {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
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
                <Label htmlFor="fileType">File Type</Label>
                <select
                  id="fileType"
                  {...register("fileType")}
                  className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {FILE_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaLabel">Meta Label</Label>
              <Input id="metaLabel" placeholder='e.g. "12 pages", "58 min", "Interactive"' {...register("metaLabel")} invalid={!!errors.metaLabel} />
              {errors.metaLabel && <p className="text-xs text-error">{errors.metaLabel.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                {...register("description")}
              />
              {errors.description && <p className="text-xs text-error">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Upload File</Label>
              <FileUploadDropzone existingFileName={resource?.fileUrl ? resource.fileUrl.split("/").pop() : undefined} onFileSelected={setPendingFile} />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-base font-semibold text-text-primary mb-4">Visibility</h3>
            <Controller
              control={control}
              name="visibility"
              render={({ field }) => (
                <div className="space-y-3">
                  {[
                    { value: "all", label: "All tiers (Pathway, Plus, Masterplan Programme)" },
                    { value: "plus-mentorship", label: "Plus & Masterplan Programme only" },
                    { value: "mentorship", label: "Masterplan Programme only" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="radio"
                        checked={field.value === option.value}
                        onChange={() => field.onChange(option.value)}
                        className="h-4 w-4 accent-sky-600"
                      />
                      <span className="text-sm text-text-secondary">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            />
          </Card>

          <Card>
            <h3 className="font-display text-base font-semibold text-text-primary mb-4">Status</h3>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <div className="space-y-3">
                  {(["Published", "Draft"] as const).map((option) => (
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

          <div className="space-y-2.5">
            <Button className="w-full" disabled={isPending} onClick={handleSubmit((values) => handleSave(values, "Published"))}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isPending ? "Saving…" : "Save & Publish"}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              disabled={isPending}
              onClick={handleSubmit((values) => handleSave(values, "Draft"))}
            >
              <FileEdit className="h-4 w-4" />
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
