"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pin, PinOff, Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/providers/toast-provider";
import {
  usePinnedAnnouncements,
  useCreatePinnedAnnouncement,
  useUnpinAnnouncement,
} from "@/features/admin-community/hooks/use-admin-community";

const schema = z.object({ title: z.string().min(6, "Give it a short, clear title") });
type FormValues = z.infer<typeof schema>;

export function PinnedAnnouncementsCard() {
  const { data: announcements, isLoading } = usePinnedAnnouncements();
  const { mutate: unpin } = useUnpinAnnouncement();
  const { toast } = useToast();

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="font-display text-base font-semibold text-text-primary">Pinned Announcements</h3>
        <NewAnnouncementDialog />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !announcements || announcements.length === 0 ? (
        <EmptyState icon={Pin} title="No pinned announcements" />
      ) : (
        <ul className="space-y-3">
          {announcements.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-orange-tint text-orange-500 flex items-center justify-center shrink-0">
                <Pin className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary leading-snug">{item.title}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.pinnedTimeLabel}</p>
              </div>
              <button
                onClick={() =>
                  unpin(item.id, { onSuccess: () => toast({ variant: "info", title: "Announcement unpinned" }) })
                }
                className="shrink-0 rounded-lg p-1.5 text-text-muted hover:bg-[#F5F8FA] hover:text-error"
                aria-label="Unpin"
              >
                <PinOff className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function NewAnnouncementDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreatePinnedAnnouncement();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  function onSubmit(values: FormValues) {
    mutate(values.title, {
      onSuccess: () => {
        reset();
        setOpen(false);
        toast({ variant: "success", title: "Announcement pinned" });
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          New Announcement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pin an announcement</DialogTitle>
          <DialogDescription>Shown at the top of the member Community page for everyone.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Announcement</Label>
            <Input id="title" {...register("title")} invalid={!!errors.title} />
            {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pin className="h-4 w-4" />}
            {isPending ? "Pinning…" : "Pin Announcement"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
