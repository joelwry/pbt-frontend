import { Sparkles, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FeaturedToolkit } from "@/features/resources/types";

export function FeaturedToolkitBanner({ toolkit }: { toolkit: FeaturedToolkit }) {
  return (
    <Card className="bg-gradient-to-r from-navy-950 to-navy-900 border-none">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-orange-500 mb-3">
            <Sparkles className="h-3 w-3" />
            {toolkit.badgeLabel}
          </span>
          <h3 className="font-display text-lg font-bold text-white">{toolkit.title}</h3>
          <p className="text-sm text-white/70 mt-2 max-w-xl">{toolkit.description}</p>
        </div>
        <Button className="bg-orange-500 hover:bg-[#d67e00] text-white shrink-0" asChild>
          <a href={toolkit.downloadUrl} download>
            <Download className="h-4 w-4" />
            Download All
          </a>
        </Button>
      </div>
    </Card>
  );
}
