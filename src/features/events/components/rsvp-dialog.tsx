"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Users } from "lucide-react";
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
import { useSubmitRsvp } from "@/features/events/hooks/use-events";
import { useState } from "react";
import type { EventItem } from "@/features/events/types";

const rsvpSchema = z.object({
  guestCount: z
    .string()
    .min(1, "Required")
    .refine((v) => Number(v) >= 1 && Number(v) <= 5, "Must be between 1 and 5"),
  notes: z.string().max(300, "Keep it under 300 characters").optional(),
});
type RsvpValues = z.infer<typeof rsvpSchema>;

export function RsvpDialog({ event, trigger }: { event: EventItem; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useSubmitRsvp();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RsvpValues>({ resolver: zodResolver(rsvpSchema), defaultValues: { guestCount: "1", notes: "" } });

  function onSubmit(values: RsvpValues) {
    mutate(
      { eventId: event.id, details: { guestCount: Number(values.guestCount), notes: values.notes ?? "" } },
      { onSuccess: () => { reset(); setOpen(false); } }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>RSVP to {event.title}</DialogTitle>
          <DialogDescription>{event.timeLabel} · {event.location}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestCount">Number attending</Label>
            <Input id="guestCount" type="number" min={1} max={5} {...register("guestCount")} invalid={!!errors.guestCount} />
            {errors.guestCount && <p className="text-xs text-error">{errors.guestCount.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">
              Dietary requirements or accessibility needs <span className="text-text-muted font-normal">(optional)</span>
            </Label>
            <textarea
              id="notes"
              rows={3}
              className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="Let us know anything we should prepare for…"
              {...register("notes")}
            />
            {errors.notes && <p className="text-xs text-error">{errors.notes.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {isPending ? "Confirming…" : "Confirm RSVP"}
          </Button>
          <p className="flex items-center gap-1.5 text-xs text-text-muted justify-center">
            <Users className="h-3.5 w-3.5" />
            You can cancel your RSVP any time before the event.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
