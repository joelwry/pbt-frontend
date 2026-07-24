"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Loader2, Save, FileEdit } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import { useAdminLesson, useSaveLesson } from "@/features/admin-content/hooks/use-admin-content";
import { FileUploadDropzone } from "@/components/shared/file-upload-dropzone";
import { MODULE_OPTIONS, type AdminLesson, type AdminLessonType, type LessonVisibility } from "@/features/admin-content/types";

const editorSchema = z.object({
  title: z.string().min(3, "Give the lesson a title"),
  programmeYear: z.string(),
  moduleId: z.string(),
  type: z.enum(["Video", "Article", "Download", "Quiz"]),
  durationLabel: z.string().min(1, "Add an estimated duration"),
  description: z.string().min(10, "Add a short description (at least 10 characters)"),
  unlockDate: z.string().min(1, "Choose an unlock date"),
  unlockTime: z.string().min(1, "Choose an unlock time"),
  visibility: z.enum(["all", "plus-mentorship", "mentorship"]),
});
type EditorFormValues = z.infer<typeof editorSchema>;

const TYPE_OPTIONS: AdminLessonType[] = ["Video", "Article", "Download", "Quiz"];
const YEAR_OPTIONS = ["2026", "2025", "2024"];

function defaultValues(): EditorFormValues {
  return {
    title: "",
    programmeYear: "2026",
    moduleId: MODULE_OPTIONS[0].id,
    type: "Video",
    durationLabel: "",
    description: "",
    unlockDate: new Date().toISOString().slice(0, 10),
    unlockTime: "06:00",
    visibility: "all",
  };
}

function buildLesson(
  values: EditorFormValues,
  status: "Published" | "Scheduled" | "Draft",
  isNew: boolean,
  lessonId: string
): AdminLesson {
  const moduleDef = MODULE_OPTIONS.find((m) => m.id === values.moduleId) ?? MODULE_OPTIONS[0];
  return {
    id: isNew ? `l_${Date.now()}` : lessonId,
    title: values.title,
    moduleLabel: moduleDef.label,
    moduleId: values.moduleId,
    programmeYear: values.programmeYear,
    type: values.type,
    durationLabel: values.durationLabel,
    description: values.description,
    unlockDate: values.unlockDate,
    unlockTime: values.unlockTime,
    status,
    visibility: values.visibility as LessonVisibility,
  };
}

export function ContentEditorView({ lessonId }: { lessonId: string }) {
  const isNew = lessonId === "new";
  const router = useRouter();
  const { toast } = useToast();
  const { data: lesson, isLoading, isError, refetch } = useAdminLesson(lessonId);
  const { mutate: saveLesson, isPending } = useSaveLesson();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditorFormValues>({ resolver: zodResolver(editorSchema), defaultValues: defaultValues() });

  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title,
        programmeYear: lesson.programmeYear,
        moduleId: lesson.moduleId,
        type: lesson.type,
        durationLabel: lesson.durationLabel,
        description: lesson.description,
        unlockDate: lesson.unlockDate,
        unlockTime: lesson.unlockTime,
        visibility: lesson.visibility,
      });
    }
  }, [lesson, reset]);

  function handleSaveAndSchedule(values: EditorFormValues) {
    const unlockDateTime = new Date(`${values.unlockDate}T${values.unlockTime}`);
    const status = unlockDateTime <= new Date() ? "Published" : "Scheduled";
    saveLesson(buildLesson(values, status, isNew, lessonId), {
      onSuccess: () => {
        toast({
          variant: "success",
          title: isNew ? "Lesson created" : "Lesson updated",
          description: status === "Published" ? "It's live now." : `Scheduled for ${values.unlockDate}.`,
        });
        router.push("/admin/content");
      },
    });
  }

  function handleSaveAsDraft(values: EditorFormValues) {
    saveLesson(buildLesson(values, "Draft", isNew, lessonId), {
      onSuccess: () => {
        toast({ variant: "info", title: "Draft saved" });
        router.push("/admin/content");
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

  if (!isNew && (isError || !lesson)) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? "Add Lesson" : "Edit Lesson"}
        description="Create or update a lesson and its scheduled unlock date."
        backHref="/admin/content"
        backLabel="Back to Content"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Lesson Details</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input id="title" {...register("title")} invalid={!!errors.title} />
              {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="programmeYear">Programme Year</Label>
                <select
                  id="programmeYear"
                  {...register("programmeYear")}
                  className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="moduleId">Module</Label>
                <select
                  id="moduleId"
                  {...register("moduleId")}
                  className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {MODULE_OPTIONS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="type">Lesson Type</Label>
                <select
                  id="type"
                  {...register("type")}
                  className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationLabel">Estimated Duration</Label>
                <Input id="durationLabel" placeholder="e.g. 24 min" {...register("durationLabel")} invalid={!!errors.durationLabel} />
                {errors.durationLabel && <p className="text-xs text-error">{errors.durationLabel.message}</p>}
              </div>
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
              <Label>Upload Content</Label>
              <FileUploadDropzone />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-base font-semibold text-text-primary mb-4">Release Schedule</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unlockDate">Unlock Date</Label>
                <Input id="unlockDate" type="date" {...register("unlockDate")} invalid={!!errors.unlockDate} />
                {errors.unlockDate && <p className="text-xs text-error">{errors.unlockDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unlockTime">Unlock Time (GMT)</Label>
                <Input id="unlockTime" type="time" {...register("unlockTime")} invalid={!!errors.unlockTime} />
                {errors.unlockTime && <p className="text-xs text-error">{errors.unlockTime.message}</p>}
              </div>
              <p className="flex items-center gap-1.5 text-xs text-text-muted">
                <Lock className="h-3.5 w-3.5" />
                Locked until unlock date/time
              </p>
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-base font-semibold text-text-primary mb-4">Visibility</h3>
            <Controller
              control={control}
              name="visibility"
              render={({ field }) => (
                <div className="space-y-3">
                  {[
                    { value: "all", label: "All tiers (Pathway, Plus, Mentorship)" },
                    { value: "plus-mentorship", label: "Plus & Mentorship only" },
                    { value: "mentorship", label: "Mentorship only" },
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

          <div className="space-y-2.5">
            <Button className="w-full" disabled={isPending} onClick={handleSubmit(handleSaveAndSchedule)}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isPending ? "Saving…" : "Save & Schedule"}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              disabled={isPending}
              onClick={handleSubmit(handleSaveAsDraft)}
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
