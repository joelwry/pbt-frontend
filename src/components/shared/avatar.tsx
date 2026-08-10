"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Falls back to an initials circle if `src` is missing or fails to load (e.g. a broken/stale upload URL). */
export function Avatar({ src, alt, initials, className }: { src?: string; alt: string; initials: string; className: string }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded photo, arbitrary storage origin
      <img src={src} alt={alt} onError={() => setFailed(true)} className={cn("object-cover", className)} />
    );
  }

  return (
    <div className={cn("bg-orange-500 text-white font-bold flex items-center justify-center", className)}>
      {initials}
    </div>
  );
}
