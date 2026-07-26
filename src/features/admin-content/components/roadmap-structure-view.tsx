"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, Loader2, Map, CalendarRange, FolderOpen } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/providers/toast-provider";
import {
  useAdminRoadmapsFull,
  useSaveRoadmap,
  useDeleteRoadmap,
  useAdminWeeks,
  useSaveWeek,
  useDeleteWeek,
  useAdminModules,
  useSaveModule,
  useDeleteModule,
} from "@/features/admin-content/hooks/use-roadmap-structure";
import type { AdminRoadmap, AdminRoadmapWeek, AdminModuleItem } from "@/features/admin-content/types";

// ---- Shared confirm-delete dialog ----

function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 mt-2">
          <DialogClose asChild>
            <Button variant="secondary" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="danger" className="flex-1" disabled={isPending} onClick={onConfirm}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- Roadmap form ----

function RoadmapFormDialog({
  open,
  onOpenChange,
  existing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing: AdminRoadmap | null;
}) {
  const { toast } = useToast();
  const { mutate: save, isPending } = useSaveRoadmap();
  const [title, setTitle] = useState(existing?.title ?? "");
  const [year, setYear] = useState(existing?.year ?? String(new Date().getFullYear()));
  const [description, setDescription] = useState(existing?.description ?? "");
  const [isCurrent, setIsCurrent] = useState(existing?.isCurrent ?? false);

  function handleSave() {
    if (!title.trim() || !year.trim()) return;
    save(
      { id: existing?.id, title: title.trim(), year: year.trim(), description: description.trim() || undefined, isCurrent },
      {
        onSuccess: () => {
          toast({ variant: "success", title: existing ? "Roadmap updated" : "Roadmap created" });
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Roadmap" : "Add Roadmap"}</DialogTitle>
          <DialogDescription>A Roadmap is the top-level learning journey for a cohort year.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roadmap-title">Title</Label>
            <Input id="roadmap-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 2027 Growth Roadmap" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roadmap-year">Year</Label>
            <Input id="roadmap-year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2027" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roadmap-description">Description</Label>
            <textarea
              id="roadmap-description"
              rows={3}
              className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <Checkbox checked={isCurrent} onCheckedChange={(v) => setIsCurrent(Boolean(v))} />
            <span className="text-sm text-text-secondary">This is the current roadmap year</span>
          </label>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <DialogClose asChild>
            <Button variant="secondary" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button className="flex-1" disabled={isPending} onClick={handleSave}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- Week form ----

function WeekFormDialog({
  open,
  onOpenChange,
  roadmapId,
  existing,
  nextWeekNumber,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roadmapId: string;
  existing: AdminRoadmapWeek | null;
  nextWeekNumber: number;
}) {
  const { toast } = useToast();
  const { mutate: save, isPending } = useSaveWeek(roadmapId);
  const [weekNumber, setWeekNumber] = useState(String(existing?.weekNumber ?? nextWeekNumber));
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");

  function handleSave() {
    const parsedNumber = parseInt(weekNumber, 10);
    if (!title.trim() || Number.isNaN(parsedNumber)) return;
    save(
      { id: existing?.id, weekNumber: parsedNumber, title: title.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          toast({ variant: "success", title: existing ? "Week updated" : "Week created" });
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Roadmap Week" : "Add Roadmap Week"}</DialogTitle>
          <DialogDescription>A time-boxed section of the roadmap that groups modules together.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="week-number">Week Number</Label>
            <Input id="week-number" type="number" min={1} value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="week-title">Title</Label>
            <Input id="week-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Foundations" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="week-description">Description</Label>
            <textarea
              id="week-description"
              rows={3}
              className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <DialogClose asChild>
            <Button variant="secondary" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button className="flex-1" disabled={isPending} onClick={handleSave}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- Module form ----

function ModuleFormDialog({
  open,
  onOpenChange,
  weekId,
  existing,
  nextModuleNumber,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekId: string;
  existing: AdminModuleItem | null;
  nextModuleNumber: number;
}) {
  const { toast } = useToast();
  const { mutate: save, isPending } = useSaveModule(weekId);
  const [moduleNumber, setModuleNumber] = useState(String(existing?.moduleNumber ?? nextModuleNumber));
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");

  function handleSave() {
    const parsedNumber = parseInt(moduleNumber, 10);
    if (!title.trim() || Number.isNaN(parsedNumber)) return;
    save(
      { id: existing?.id, moduleNumber: parsedNumber, title: title.trim(), description: description.trim() || undefined },
      {
        onSuccess: () => {
          toast({ variant: "success", title: existing ? "Module updated" : "Module created" });
          onOpenChange(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? "Edit Module" : "Add Module"}</DialogTitle>
          <DialogDescription>Lessons attach to a module. Manage lessons from Content Management once this exists.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="module-number">Module Number</Label>
            <Input id="module-number" type="number" min={1} value={moduleNumber} onChange={(e) => setModuleNumber(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="module-title">Title</Label>
            <Input id="module-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Foundations of Property Investing" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="module-description">Description</Label>
            <textarea
              id="module-description"
              rows={3}
              className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-5">
          <DialogClose asChild>
            <Button variant="secondary" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button className="flex-1" disabled={isPending} onClick={handleSave}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- Modules within a week ----

function ModulesList({ weekId }: { weekId: string }) {
  const { data: modules, isLoading } = useAdminModules(weekId, true);
  const { mutate: deleteModule, isPending: isDeleting } = useDeleteModule(weekId);
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminModuleItem | null>(null);
  const [deletingModule, setDeletingModule] = useState<AdminModuleItem | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2 pl-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="pl-6 space-y-2">
      {(modules ?? []).map((m) => (
        <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-[#FAFCFD] px-3.5 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <FolderOpen className="h-4 w-4 text-text-muted shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                Module {m.moduleNumber} · {m.title}
              </p>
              <p className="text-xs text-text-muted">{m.lessonCount} lesson{m.lessonCount === 1 ? "" : "s"}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                setEditing(m);
                setFormOpen(true);
              }}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-white text-text-muted hover:text-text-primary"
              aria-label={`Edit module ${m.title}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDeletingModule(m)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-white text-text-muted hover:text-error"
              aria-label={`Delete module ${m.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      >
        <Plus className="h-3.5 w-3.5" />
        Add Module
      </Button>

      <ModuleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        weekId={weekId}
        existing={editing}
        nextModuleNumber={(modules?.length ?? 0) + 1}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingModule)}
        onOpenChange={(open) => !open && setDeletingModule(null)}
        title={`Delete "${deletingModule?.title}"?`}
        description={
          deletingModule && deletingModule.lessonCount > 0
            ? `This module has ${deletingModule.lessonCount} lesson(s). Deleting it won't delete those lessons, but they'll be orphaned from a visible module. This can't be undone.`
            : "This can't be undone."
        }
        isPending={isDeleting}
        onConfirm={() =>
          deletingModule &&
          deleteModule(deletingModule.id, {
            onSuccess: () => {
              toast({ variant: "success", title: "Module deleted" });
              setDeletingModule(null);
            },
          })
        }
      />
    </div>
  );
}

// ---- Weeks within a roadmap ----

function WeeksList({ roadmapId }: { roadmapId: string }) {
  const { data: weeks, isLoading } = useAdminWeeks(roadmapId, true);
  const { mutate: deleteWeek, isPending: isDeleting } = useDeleteWeek(roadmapId);
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRoadmapWeek | null>(null);
  const [deletingWeek, setDeletingWeek] = useState<AdminRoadmapWeek | null>(null);
  const [expandedWeekId, setExpandedWeekId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2 pl-6 pt-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="pl-6 pt-3 space-y-3 border-t border-border mt-3">
      {(weeks ?? []).length === 0 && (
        <p className="text-sm text-text-muted">No roadmap weeks yet — add one to start building modules and lessons.</p>
      )}

      {(weeks ?? []).map((week) => {
        const isExpanded = expandedWeekId === week.id;
        return (
          <div key={week.id} className="rounded-xl border border-border">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <button
                onClick={() => setExpandedWeekId(isExpanded ? null : week.id)}
                className="flex items-center gap-2 min-w-0 text-left flex-1"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
                )}
                <CalendarRange className="h-4 w-4 text-sky-600 shrink-0" />
                <span className="text-sm font-semibold text-text-primary truncate">
                  Week {week.weekNumber} · {week.title}
                </span>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setEditing(week);
                    setFormOpen(true);
                  }}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-text-primary"
                  aria-label={`Edit week ${week.title}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeletingWeek(week)}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#FEF2F2] text-text-muted hover:text-error"
                  aria-label={`Delete week ${week.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {isExpanded && (
              <div className="px-4 pb-4">
                <ModulesList weekId={week.id} />
              </div>
            )}
          </div>
        );
      })}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      >
        <Plus className="h-3.5 w-3.5" />
        Add Week
      </Button>

      <WeekFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        roadmapId={roadmapId}
        existing={editing}
        nextWeekNumber={(weeks?.length ?? 0) + 1}
      />

      <ConfirmDeleteDialog
        open={Boolean(deletingWeek)}
        onOpenChange={(open) => !open && setDeletingWeek(null)}
        title={`Delete "${deletingWeek?.title}"?`}
        description="Its modules are not automatically deleted. This can't be undone."
        isPending={isDeleting}
        onConfirm={() =>
          deletingWeek &&
          deleteWeek(deletingWeek.id, {
            onSuccess: () => {
              toast({ variant: "success", title: "Week deleted" });
              setDeletingWeek(null);
            },
          })
        }
      />
    </div>
  );
}

// ---- Top-level roadmaps ----

export function RoadmapStructureView() {
  const { data: roadmaps, isLoading, isError, refetch } = useAdminRoadmapsFull();
  const { mutate: deleteRoadmap, isPending: isDeleting } = useDeleteRoadmap();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRoadmap | null>(null);
  const [deletingRoadmap, setDeletingRoadmap] = useState<AdminRoadmap | null>(null);
  const [expandedRoadmapId, setExpandedRoadmapId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roadmap Structure"
        description="Manage the Roadmap → Week → Module hierarchy that lessons attach to. Create these before adding lessons for a new year in Content Management."
        backHref="/admin/content"
        backLabel="Back to Content"
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add Roadmap
          </Button>
        }
      />

      <Card>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : isError || !roadmaps ? (
          <ErrorState onRetry={() => refetch()} />
        ) : roadmaps.length === 0 ? (
          <EmptyState icon={Map} title="No roadmaps yet" description="Add one to start building this year's learning journey." />
        ) : (
          <div className="space-y-3">
            {roadmaps.map((roadmap) => {
              const isExpanded = expandedRoadmapId === roadmap.id;
              return (
                <div key={roadmap.id} className="rounded-xl border border-border">
                  <div className="flex items-center justify-between gap-3 px-4 py-3.5 flex-wrap">
                    <button
                      onClick={() => setExpandedRoadmapId(isExpanded ? null : roadmap.id)}
                      className="flex items-center gap-2.5 min-w-0 text-left flex-1"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-text-muted shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
                      )}
                      <Map className="h-4 w-4 text-navy-900 shrink-0" />
                      <span className="font-display font-semibold text-text-primary truncate">{roadmap.title}</span>
                      {roadmap.isCurrent && <Badge variant="sky">Current</Badge>}
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setEditing(roadmap);
                          setFormOpen(true);
                        }}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-text-primary"
                        aria-label={`Edit roadmap ${roadmap.title}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingRoadmap(roadmap)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#FEF2F2] text-text-muted hover:text-error"
                        aria-label={`Delete roadmap ${roadmap.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <WeeksList roadmapId={roadmap.id} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <RoadmapFormDialog open={formOpen} onOpenChange={setFormOpen} existing={editing} />

      <ConfirmDeleteDialog
        open={Boolean(deletingRoadmap)}
        onOpenChange={(open) => !open && setDeletingRoadmap(null)}
        title={`Delete "${deletingRoadmap?.title}"?`}
        description="Its weeks and modules are not automatically deleted. This can't be undone."
        isPending={isDeleting}
        onConfirm={() =>
          deletingRoadmap &&
          deleteRoadmap(deletingRoadmap.id, {
            onSuccess: () => {
              toast({ variant: "success", title: "Roadmap deleted" });
              setDeletingRoadmap(null);
            },
          })
        }
      />
    </div>
  );
}
