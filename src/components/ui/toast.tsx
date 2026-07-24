"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; iconClass: string; barClass: string }
> = {
  success: { icon: CheckCircle2, iconClass: "text-[#15803D] bg-[#DCFCE7]", barClass: "bg-success" },
  error: { icon: XCircle, iconClass: "text-[#B91C1C] bg-[#FEE2E2]", barClass: "bg-error" },
  warning: { icon: AlertTriangle, iconClass: "text-[#B45309] bg-[#FEF3C7]", barClass: "bg-warning" },
  info: { icon: Info, iconClass: "text-sky-600 bg-sky-tint", barClass: "bg-sky-500" },
};

export function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const config = VARIANT_CONFIG[toast.variant];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-white shadow-lg"
      role="status"
    >
      <span className={cn("absolute left-0 top-0 h-full w-1", config.barClass)} />
      <div className="flex items-start gap-3 py-3.5 pl-4 pr-3">
        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0", config.iconClass)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold text-text-primary leading-snug">{toast.title}</p>
          {toast.description && <p className="text-xs text-text-muted mt-1 leading-relaxed">{toast.description}</p>}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="shrink-0 rounded-full p-1 text-text-muted hover:bg-[#F5F8FA] hover:text-text-primary"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
