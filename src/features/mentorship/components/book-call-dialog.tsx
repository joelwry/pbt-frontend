"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Loader2, Plus } from "lucide-react";
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
import { useBookCall } from "@/features/mentorship/hooks/use-mentorship";
import { useState } from "react";

const bookCallSchema = z.object({
  topic: z.string().min(4, "Give the call a short topic"),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
});
type BookCallValues = z.infer<typeof bookCallSchema>;

export function BookCallDialog({ mentorName, triggerLabel = "Book another" }: { mentorName: string; triggerLabel?: string }) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useBookCall();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookCallValues>({ resolver: zodResolver(bookCallSchema) });

  function onSubmit(values: BookCallValues) {
    const dateObj = new Date(`${values.date}T${values.time}`);
    const dateLabel = dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const timeLabel = dateObj.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" });

    mutate(
      { topic: values.topic, dateLabel: `${dateLabel}, ${timeLabel}`, mentorName },
      { onSuccess: () => { reset(); setOpen(false); } }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Plus className="h-3.5 w-3.5" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book a mentorship call</DialogTitle>
          <DialogDescription>Schedule a 45-minute session with {mentorName}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input id="topic" placeholder="e.g. Q4 Portfolio Review" {...register("topic")} invalid={!!errors.topic} />
            {errors.topic && <p className="text-xs text-error">{errors.topic.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} invalid={!!errors.date} />
              {errors.date && <p className="text-xs text-error">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" {...register("time")} invalid={!!errors.time} />
              {errors.time && <p className="text-xs text-error">{errors.time.message}</p>}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
            {isPending ? "Booking…" : "Confirm Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
