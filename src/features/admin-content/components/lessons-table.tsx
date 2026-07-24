"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Pencil, Trash2, Loader2, Play, FileText, Download, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useDeleteLesson } from "@/features/admin-content/hooks/use-admin-content";
import { useToast } from "@/providers/toast-provider";
import type { AdminLesson, AdminLessonType } from "@/features/admin-content/types";

const TYPE_ICON: Record<AdminLessonType, typeof Play> = { Video: Play, Article: FileText, Download: Download, Quiz: ListChecks };
const TYPE_VARIANT: Record<AdminLessonType, "sky" | "outline" | "slate"> = {
  Video: "sky",
  Article: "outline",
  Download: "slate",
  Quiz: "sky",
};
const STATUS_VARIANT = { Published: "success" as const, Scheduled: "orange" as const, Draft: "outline" as const };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function LessonsTable({ lessons }: { lessons: AdminLesson[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
            <th className="py-3 pr-4">Lesson Title</th>
            <th className="py-3 pr-4">Module</th>
            <th className="py-3 pr-4">Type</th>
            <th className="py-3 pr-4">Unlock Date</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LessonRow({ lesson }: { lesson: AdminLesson }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteLesson, isPending } = useDeleteLesson();
  const { toast } = useToast();
  const TypeIcon = TYPE_ICON[lesson.type];

  function handleDelete() {
    deleteLesson(lesson.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast({ variant: "success", title: "Lesson deleted", description: `"${lesson.title}" has been removed.` });
      },
    });
  }

  return (
    <tr>
      <td className="py-3.5 pr-4 font-semibold text-text-primary">{lesson.title}</td>
      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">{lesson.moduleLabel}</td>
      <td className="py-3.5 pr-4">
        <Badge variant={TYPE_VARIANT[lesson.type]}>
          <TypeIcon className="h-3 w-3" />
          {lesson.type}
        </Badge>
      </td>
      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">{formatDate(lesson.unlockDate)}</td>
      <td className="py-3.5 pr-4">
        <Badge variant={STATUS_VARIANT[lesson.status]}>{lesson.status}</Badge>
      </td>
      <td className="py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/content/${lesson.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-sky-600"
            aria-label={`View ${lesson.title}`}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/content/${lesson.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-text-primary"
            aria-label={`Edit ${lesson.title}`}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#FEF2F2] text-text-muted hover:text-error"
              aria-label={`Delete ${lesson.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete &ldquo;{lesson.title}&rdquo;?</DialogTitle>
                <DialogDescription>
                  This removes the lesson from the schedule entirely. Members who&apos;ve already completed it will
                  keep their progress record. This can&apos;t be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-3 mt-2">
                <DialogClose asChild>
                  <Button variant="secondary" className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant="danger" className="flex-1" disabled={isPending} onClick={handleDelete}>
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isPending ? "Deleting…" : "Delete Lesson"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
