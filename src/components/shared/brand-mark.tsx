import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 36, className }: BrandMarkProps) {
  return (
    <div
      className={cn("relative shrink-0 rounded-lg bg-white p-1 overflow-hidden", className)}
      style={{ height: size, width: size }}
    >
      <Image
        src="/brand/pbt-logo.jpg"
        alt="Property Business Training"
        fill
        sizes={`${size}px`}
        className="object-contain"
        priority
      />
    </div>
  );
}
