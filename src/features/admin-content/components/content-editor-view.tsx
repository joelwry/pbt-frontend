"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import {
  useAdminLesson,
  useSaveLesson,
  useAdminModuleOptions,
  useAdminRoadmapYears,
  useUploadLessonAsset,
} from "@/features/admin-content/hooks/use-admin-content";
import { FileUploadDropzone } from "@/components/shared/file-upload-dropzone";
import { RichTextEditor } from "@/features/admin-content/components/rich-text-editor";
import { QuizQuestionBuilder, newQuestion } from "@/features/admin-content/components/quiz-question-builder";
import type { AdminLesson, AdminLessonType, AdminQuizQuestion, LessonVisibility } from "@/features/admin-content/types";

const quizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
});

const editorSchema = z.object({
  title: z.string().min(3, "Give the lesson a title"),
  programmeYear: z.string(),
  moduleId: z.string().min(1, "Choose a module"),
  type: z.enum(["Video", "Article", "Download", "Quiz"]),
  durationLabel: z.string().min(1, "Add an estimated duration"),
  description: z.string().min(10, "Add a short description (at least 10 characters)"),
  unlockDate: z.string().min(1, "Choose an unlock date"),
  unlockTime: z.string().min(1, "Choose an unlock time"),
  visibility: z.enum(["all", "plus-mentorship", "mentorship"]),
  transcript: z.string().optional(),
  articleHtml: z.string().optional(),
  questions: z.array(quizQuestionSchema).optional(),
});
type EditorFormValues = z.infer<typeof editorSchema>;

const TYPE_OPTIONS: AdminLessonType[] = ["Video", "Article", "Download", "Quiz"];

function defaultValues(): EditorFormValues {
  return {
    title: "",
    programmeYear: "",
    moduleId: "",
    type: "Video",
    durationLabel: "",
    description: "",
    unlockDate: new Date().toISOString().slice(0, 10),
    unlockTime: "06:00",
    visibility: "all",
    transcript: "",
    articleHtml: "",
    questions: [],
  };
}

function buildLesson(values: EditorFormValues, moduleLabel: string, status: "Published" | "Scheduled" | "Draft", lessonId: string): AdminLesson {
  return {
    id: lessonId,
    title: values.title,
    moduleLabel,
    moduleId: values.moduleId,
    programmeYear: values.programmeYear,
    type: values.type,
    durationLabel: values.durationLabel,
    description: values.description,
    unlockDate: values.unlockDate,
    unlockTime: values.unlockTime,
    status,
    visibility: values.visibility as LessonVisibility,
    transcript: values.transcript,
    articleHtml: values.articleHtml,
    questions: values.questions as AdminQuizQuestion[] | undefined,
  };
}

export function ContentEditorView({ lessonId }: { lessonId: string }) {
  const isNew = lessonId === "new";
  const router = useRouter();
  const { toast } = useToast();
  const { data: lesson, isLoading, isError, refetch } = useAdminLesson(lessonId);
  const { data: moduleOptions, isLoading: moduleOptionsLoading } = useAdminModuleOptions();
  const { data: roadmapYears, isLoading: roadmapYearsLoading } = useAdminRoadmapYears();
  const { mutate: saveLesson, isPending } = useSaveLesson();
  const { mutateAsync: uploadAsset, isPending: isUploading } = useUploadLessonAsset();
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditorFormValues>({ resolver: zodResolver(editorSchema), defaultValues: defaultValues() });

  // Sourced from the real roadmap list, not from moduleOptions — a
  // brand-new roadmap with no weeks/modules yet still needs to appear here,
  // otherwise there's no way to even select it to be told "create a module
  // first" (previously this list silently dropped any such roadmap).
  const years = useMemo(() => [...(roadmapYears ?? [])], [roadmapYears]);
  const selectedYear = watch("programmeYear");
  const selectedType = watch("type");
  const questions = watch("questions");
  const modulesForYear = useMemo(
    () => (moduleOptions ?? []).filter((m) => m.year === selectedYear),
    [moduleOptions, selectedYear]
  );

  // Switching to Quiz with no questions yet: seed one empty question so the
  // builder isn't just a bare "Add Question" button.
  useEffect(() => {
    if (selectedType === "Quiz" && (questions ?? []).length === 0) {
      setValue("questions", [newQuestion()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  // Once module options load, default a brand-new lesson to the current
  // roadmap year and its first module — the form can't know these until the
  // real hierarchy has been fetched.
  useEffect(() => {
    if (isNew && !selectedYear && years.length > 0) {
      const year = years[0];
      const firstModule = (moduleOptions ?? []).find((m) => m.year === year);
      reset({ ...defaultValues(), programmeYear: year, moduleId: firstModule?.id ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, years, moduleOptions]);

  // Switching the year: snap the module selection to the first module in
  // that year, since the previously-selected module belongs to a different
  // roadmap entirely.
  function handleYearChange(year: string) {
    setValue("programmeYear", year);
    const firstModule = (moduleOptions ?? []).find((m) => m.year === year);
    setValue("moduleId", firstModule?.id ?? "");
  }

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
        transcript: lesson.transcript ?? "",
        articleHtml: lesson.articleHtml ?? "",
        questions: lesson.questions ?? [],
      });
    }
  }, [lesson, reset]);

  async function afterSave(saved: AdminLesson) {
    if (pendingFile) {
      try {
        await uploadAsset({ lessonId: saved.id, file: pendingFile });
      } catch {
        toast({ variant: "error", title: "Lesson saved, but the file upload failed", description: "You can try uploading again from Edit Lesson." });
      }
    }
  }

  function currentModuleLabel(values: EditorFormValues): string {
    return (moduleOptions ?? []).find((m) => m.id === values.moduleId)?.label ?? lesson?.moduleLabel ?? "";
  }

  function handleSaveAndSchedule(values: EditorFormValues) {
    const unlockDateTime = new Date(`${values.unlockDate}T${values.unlockTime}`);
    const status = unlockDateTime <= new Date() ? "Published" : "Scheduled";
    saveLesson(buildLesson(values, currentModuleLabel(values), status, isNew ? "" : lessonId), {
      onSuccess: async (saved) => {
        await afterSave(saved);
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
    saveLesson(buildLesson(values, currentModuleLabel(values), "Draft", isNew ? "" : lessonId), {
      onSuccess: async (saved) => {
        await afterSave(saved);
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

  const saving = isPending || isUploading;

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
                <Label htmlFor="programmeYear">Roadmap Year</Label>
                <select
                  id="programmeYear"
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  disabled={roadmapYearsLoading}
                  className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {years.length === 0 && <option value="">No roadmaps yet</option>}
                  {years.map((y) => (
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
                  disabled={moduleOptionsLoading || modulesForYear.length === 0}
                  className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {modulesForYear.length === 0 && <option value="">No modules for this year</option>}
                  {modulesForYear.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                {errors.moduleId && <p className="text-xs text-error">{errors.moduleId.message}</p>}
                {!moduleOptionsLoading && modulesForYear.length === 0 && (
                  <p className="text-xs text-text-muted">
                    No modules exist yet for this year.{" "}
                    <Link href="/admin/content/roadmaps" className="text-sky-600 hover:underline">
                      Create a roadmap week and module first
                    </Link>
                    .
                  </p>
                )}
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

            {selectedType === "Video" && (
              <>
                <div className="space-y-2">
                  <Label>Video File</Label>
                  <FileUploadDropzone onFileSelected={setPendingFile} />
                  {!pendingFile && lesson?.videoUrl && (
                    <p className="text-xs text-text-muted">
                      Current video:{" "}
                      <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                        view file
                      </a>
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transcript">Transcript / Summary (optional)</Label>
                  <textarea
                    id="transcript"
                    rows={4}
                    placeholder="A written summary or transcript shown under the video player."
                    className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    {...register("transcript")}
                  />
                </div>
              </>
            )}

            {selectedType === "Article" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="articleHtml">Article Content</Label>
                  <Controller
                    control={control}
                    name="articleHtml"
                    render={({ field }) => (
                      <RichTextEditor value={field.value ?? ""} onChange={field.onChange} placeholder="Write the article here…" />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Attach a file (optional)</Label>
                  <FileUploadDropzone onFileSelected={setPendingFile} />
                </div>
              </>
            )}

            {selectedType === "Download" && (
              <div className="space-y-2">
                <Label>File to Download</Label>
                <FileUploadDropzone onFileSelected={setPendingFile} />
                {!pendingFile && lesson?.fileUrl && (
                  <p className="text-xs text-text-muted">
                    Current file:{" "}
                    <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                      view file
                    </a>
                  </p>
                )}
              </div>
            )}

            {selectedType === "Quiz" && (
              <div className="space-y-2">
                <Label>Quiz Questions</Label>
                <Controller
                  control={control}
                  name="questions"
                  render={({ field }) => (
                    <QuizQuestionBuilder questions={(field.value as AdminQuizQuestion[]) ?? []} onChange={field.onChange} />
                  )}
                />
              </div>
            )}
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
                <Label htmlFor="unlockTime">Unlock Time</Label>
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

          <div className="space-y-2.5">
            <Button className="w-full" disabled={saving} onClick={handleSubmit(handleSaveAndSchedule)}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : "Save & Schedule"}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              disabled={saving}
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
