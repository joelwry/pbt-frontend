"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { useDeleteEvent } from "@/features/admin-events/hooks/use-admin-events";
import { useToast } from "@/providers/toast-provider";
import type { AdminEvent, AdminEventType } from "@/features/admin-events/types";

const TYPE_VARIANT: Record<AdminEventType, "sky" | "orange" | "outline"> = {
  "Live Online": "sky",
  Workshop: "orange",
  "In-Person": "outline",
};
const STATUS_VARIANT = { Upcoming: "success" as const, Completed: "outline" as const, Cancelled: "error" as const };

function formatDateTime(iso: string, startTime: string) {
  const date = new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const [h, m] = startTime.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${date} · ${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function EventsTable({ events }: { events: AdminEvent[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] font-semibold text-text-muted uppercase tracking-wide border-b border-border">
            <th className="py-3 pr-4">Event</th>
            <th className="py-3 pr-4">Date & Time</th>
            <th className="py-3 pr-4">Type</th>
            <th className="py-3 pr-4">RSVPs</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {events.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventRow({ event }: { event: AdminEvent }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteEvent, isPending } = useDeleteEvent();
  const { toast } = useToast();

  function handleDelete() {
    deleteEvent(event.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast({ variant: "success", title: "Event deleted", description: `"${event.title}" has been removed.` });
      },
    });
  }

  return (
    <tr>
      <td className="py-3.5 pr-4 font-semibold text-text-primary">{event.title}</td>
      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">{formatDateTime(event.date, event.startTime)}</td>
      <td className="py-3.5 pr-4">
        <Badge variant={TYPE_VARIANT[event.type]}>{event.type}</Badge>
      </td>
      <td className="py-3.5 pr-4 text-text-secondary whitespace-nowrap">
        {event.rsvpCount} / {event.capacity}
      </td>
      <td className="py-3.5 pr-4">
        <Badge variant={STATUS_VARIANT[event.status]}>{event.status}</Badge>
      </td>
      <td className="py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/events/${event.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-sky-600"
            aria-label={`View ${event.title}`}
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/events/${event.id}`}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#F5F8FA] text-text-muted hover:text-text-primary"
            aria-label={`Edit ${event.title}`}
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <button
              onClick={() => setDeleteOpen(true)}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-[#FEF2F2] text-text-muted hover:text-error"
              aria-label={`Delete ${event.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete &ldquo;{event.title}&rdquo;?</DialogTitle>
                <DialogDescription>
                  This removes the event entirely, including its RSVP list. Consider using Cancel Event instead if
                  members have already RSVP&apos;d. This can&apos;t be undone.
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
                  {isPending ? "Deleting…" : "Delete Event"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
