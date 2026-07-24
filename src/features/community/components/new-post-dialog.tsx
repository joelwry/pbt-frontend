"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2 } from "lucide-react";
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
import { useCreateDiscussion } from "@/features/community/hooks/use-community";
import { useState } from "react";

const postSchema = z.object({
  title: z.string().min(6, "Give your post a short, clear title"),
  excerpt: z.string().min(20, "Share a bit more detail (at least 20 characters)"),
});
type PostFormValues = z.infer<typeof postSchema>;

export function NewPostDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateDiscussion();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({ resolver: zodResolver(postSchema) });

  function onSubmit(values: PostFormValues) {
    mutate(values, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a discussion</DialogTitle>
          <DialogDescription>Share a question or insight with the PBT community.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Best areas for HMOs in 2026" {...register("title")} invalid={!!errors.title} />
            {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">What&apos;s on your mind?</Label>
            <textarea
              id="excerpt"
              rows={4}
              className="flex w-full rounded-[var(--radius-input)] border border-border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              placeholder="Share the detail behind your question or update…"
              {...register("excerpt")}
            />
            {errors.excerpt && <p className="text-xs text-error">{errors.excerpt.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isPending ? "Posting…" : "Post to Community"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
