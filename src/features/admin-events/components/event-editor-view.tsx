"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import { useAdminEvent, useSaveEvent, useCancelEvent } from "@/features/admin-events/hooks/use-admin-events";
import { CurrentRsvpsCard } from "@/features/admin-events/components/current-rsvps-card";
import type { AdminEvent, AdminEventType, EventRsvpVisibility } from "@/features/admin-events/types";

const EVENT_TYPES: AdminEventType[] = ["Mentorship", "In-Person", "Community", "Masterclass", "Onboarding"];

const editorSchema = z.object({
  title: z.string().min(3, "Give the event a title"),
  type: z.enum(["Mentorship", "In-Person", "Community", "Masterclass", "Onboarding"]),
  capacity: z.string().min(1, "Set a capacity").refine((v) => Number(v) > 0, "Must be greater than 0"),
  date: z.string().min(1, "Choose a date"),
  startTime: z.string().min(1, "Choose a start time"),
  endTime: z.string().min(1, "Choose an end time"),
  location: z.string().min(2, "Add a location or link"),
  description: z.string().min(10, "Add a short description (at least 10 characters)"),
  visibility: z.enum(["all", "plus-mentorship", "mentorship"]),
});
type EditorFormValues = z.infer<typeof editorSchema>;

function defaultValues(): EditorFormValues {
  return {
    title: "",
    type: "Mentorship",
    capacity: "50",
    date: new Date().toISOString().slice(0, 10),
    startTime: "18:00",
    endTime: "19:00",
    location: "",
    description: "",
    visibility: "all",
  };
}

function buildEvent(values: EditorFormValues, isNew: boolean, eventId: string, existingRsvpCount: number): AdminEvent {
  const eventDate = new Date(`${values.date}T${values.startTime}`);
  return {
    id: isNew ? "" : eventId,
    title: values.title,
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    type: values.type,
    rsvpCount: existingRsvpCount,
    capacity: Number(values.capacity),
    status: eventDate < new Date() ? "Completed" : "Upcoming",
    location: values.location,
    description: values.description,
    visibility: values.visibility as EventRsvpVisibility,
  };
}

export function EventEditorView({ eventId }: { eventId: string }) {
  const isNew = eventId === "new";
  const router = useRouter();
  const { toast } = useToast();
  const { data: event, isLoading, isError, refetch } = useAdminEvent(eventId);
  const { mutate: saveEvent, isPending } = useSaveEvent();
  const { mutate: cancelEvent, isPending: isCancelling } = useCancelEvent();
  const [cancelOpen, setCancelOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditorFormValues>({ resolver: zodResolver(editorSchema), defaultValues: defaultValues() });

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        type: event.type,
        capacity: String(event.capacity),
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        location: event.location,
        description: event.description,
        visibility: event.visibility,
      });
    }
  }, [event, reset]);

  function handleSave(values: EditorFormValues) {
    saveEvent(buildEvent(values, isNew, eventId, event?.rsvpCount ?? 0), {
      onSuccess: () => {
        toast({ variant: "success", title: isNew ? "Event created" : "Event updated" });
        router.push("/admin/events");
      },
    });
  }

  function handleCancelEvent() {
    cancelEvent(eventId, {
      onSuccess: () => {
        setCancelOpen(false);
        toast({ variant: "info", title: "Event cancelled", description: "RSVP'd members will be notified." });
        router.push("/admin/events");
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

  if (!isNew && (isError || !event)) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNew ? "Add Event" : "Edit Event"}
        description="Create or update an event and its RSVP settings."
        backHref="/admin/events"
        backLabel="Back to Events"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-5">Event Details</h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" {...register("title")} invalid={!!errors.title} />
              {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <select
                  id="type"
                  {...register("type")}
                  className="flex h-11 w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" min={1} {...register("capacity")} invalid={!!errors.capacity} />
                {errors.capacity && <p className="text-xs text-error">{errors.capacity.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" {...register("date")} invalid={!!errors.date} />
                {errors.date && <p className="text-xs text-error">{errors.date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Start – End Time</Label>
                <div className="flex items-center gap-2">
                  <Input type="time" {...register("startTime")} invalid={!!errors.startTime} />
                  <span className="text-text-muted text-sm">–</span>
                  <Input type="time" {...register("endTime")} invalid={!!errors.endTime} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location / Link</Label>
              <Input id="location" placeholder="Online — link sent 1 hour before start" {...register("location")} invalid={!!errors.location} />
              {errors.location && <p className="text-xs text-error">{errors.location.message}</p>}
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
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-base font-semibold text-text-primary mb-4">Who Can RSVP</h3>
            <Controller
              control={control}
              name="visibility"
              render={({ field }) => (
                <div className="space-y-3">
                  {[
                    { value: "all", label: "All tiers" },
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

          {!isNew && event && <CurrentRsvpsCard rsvpCount={event.rsvpCount} capacity={event.capacity} />}

          <div className="space-y-2.5">
            <Button className="w-full" disabled={isPending} onClick={handleSubmit(handleSave)}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isPending ? "Saving…" : "Save & Publish"}
            </Button>

            {!isNew && event && event.status !== "Cancelled" && (
              <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <button
                  onClick={() => setCancelOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 text-sm font-semibold text-error hover:underline py-2"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel Event
                </button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel &ldquo;{event.title}&rdquo;?</DialogTitle>
                    <DialogDescription>
                      All {event.rsvpCount} RSVP&apos;d members will be notified that this event has been cancelled.
                      The event stays on record as Cancelled.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center gap-3 mt-2">
                    <DialogClose asChild>
                      <Button variant="secondary" className="flex-1">
                        Keep Event
                      </Button>
                    </DialogClose>
                    <Button variant="danger" className="flex-1" disabled={isCancelling} onClick={handleCancelEvent}>
                      {isCancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isCancelling ? "Cancelling…" : "Yes, Cancel Event"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
