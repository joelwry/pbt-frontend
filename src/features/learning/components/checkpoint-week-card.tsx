"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trophy, PlayCircle, MessageCircleQuestion, Loader2, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/providers/toast-provider";
import { useSubmitQuestion } from "@/features/learning/hooks/use-learning";
import type { RoadmapWeekSummary } from "@/features/learning/types";

const questionSchema = z.object({
  title: z.string().min(4, "Give your question a short title"),
  description: z.string().min(10, "Add a bit more detail so we can help"),
});
type QuestionValues = z.infer<typeof questionSchema>;

function SubmitQuestionDialog({ weekNumber }: { weekNumber: number }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { mutate, isPending } = useSubmitQuestion();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionValues>({ resolver: zodResolver(questionSchema) });

  function onSubmit(values: QuestionValues) {
    mutate(
      { title: values.title, description: values.description, category: `Checkpoint Week ${weekNumber}` },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
          toast({ variant: "success", title: "Question submitted", description: "We'll get back to you soon." });
        },
        onError: () => {
          toast({ variant: "error", title: "Couldn't submit your question", description: "Please try again." });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <MessageCircleQuestion className="h-4 w-4" />
          Submit a Question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit a question</DialogTitle>
          <DialogDescription>Anything unclear from Week {weekNumber}? Ask here and we&apos;ll follow up.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question-title">Question</Label>
            <Input id="question-title" placeholder="e.g. How do I calculate BRRR yield?" {...register("title")} invalid={!!errors.title} />
            {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="question-description">Details</Label>
            <textarea
              id="question-description"
              rows={4}
              className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="Give us a bit more context…"
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-error">{errors.description.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isPending ? "Submitting…" : "Submit Question"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CheckpointWeekCard({ week }: { week: RoadmapWeekSummary }) {
  const { toast } = useToast();

  return (
    <Card className="relative overflow-hidden border-none bg-linear-to-br from-navy-950 to-navy-900 !p-0">
      <div className="px-6 py-7 sm:px-8 sm:py-8">
        <Badge variant="orange" className="mb-4">
          <Trophy className="h-3 w-3" />
          Checkpoint Week
        </Badge>
        <h2 className="font-display text-2xl font-bold text-white leading-snug">
          Week {week.weekNumber} · {week.title}
        </h2>
        {week.description && <p className="text-sm text-white/70 mt-2 max-w-2xl leading-relaxed">{week.description}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl bg-white/5 border border-white/10 px-5 py-5">
            <h3 className="font-display text-sm font-semibold text-white mb-1.5">Review Learning</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Take a moment to look back over everything covered so far before moving on to the next stage of your
              roadmap.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              toast({ variant: "info", title: "Video summary coming soon", description: "Kudirat's recap video for this checkpoint will appear here." })
            }
            className="text-left rounded-xl bg-white/5 border border-white/10 px-5 py-5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <PlayCircle className="h-4 w-4 text-orange-500 shrink-0" />
              <h3 className="font-display text-sm font-semibold text-white">Video Summary</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Watch a short video recap of the topics covered since your last checkpoint.
            </p>
          </button>
        </div>

        <div className="mt-6">
          <SubmitQuestionDialog weekNumber={week.weekNumber} />
        </div>
      </div>
    </Card>
  );
}
