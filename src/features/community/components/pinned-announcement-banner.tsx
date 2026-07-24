import Link from "next/link";
import { Pin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PinnedAnnouncement } from "@/features/community/types";

export function PinnedAnnouncementBanner({ announcement }: { announcement: PinnedAnnouncement }) {
  return (
    <Card className="bg-gradient-to-r from-navy-950 to-sky-600 border-none">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-orange-500 mb-3">
            <Pin className="h-3 w-3" />
            {announcement.badgeLabel}
          </span>
          <h3 className="font-display text-lg font-bold text-white max-w-xl">{announcement.title}</h3>
          <p className="text-sm text-white/70 mt-2 max-w-xl leading-relaxed">{announcement.body}</p>
          <Button
            size="sm"
            className="mt-4 bg-orange-500 hover:bg-[#d67e00] text-white"
            asChild
          >
            <Link href={announcement.ctaHref}>{announcement.ctaLabel} →</Link>
          </Button>
        </div>
        <span className="text-xs text-white/50 shrink-0">{announcement.postedByLabel}</span>
      </div>
    </Card>
  );
}
