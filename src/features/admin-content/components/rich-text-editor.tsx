"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TOOLBAR_ACTIONS = [
  { command: "bold", icon: Bold, label: "Bold" },
  { command: "italic", icon: Italic, label: "Italic" },
  { command: "formatBlock:h3", icon: Heading2, label: "Heading" },
  { command: "insertUnorderedList", icon: List, label: "Bullet list" },
  { command: "insertOrderedList", icon: ListOrdered, label: "Numbered list" },
] as const;

/**
 * Deliberately simple -- a contentEditable div + document.execCommand
 * toolbar, not a full editor library. Article lessons need "properly
 * formatted, not overly complex" authoring (bold/italic/headings/lists),
 * not a rich document system.
 */
export function RichTextEditor({ value, onChange, placeholder }: { value: string; onChange: (html: string) => void; placeholder?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (ref.current && isFirstRender.current) {
      ref.current.innerHTML = value;
      isFirstRender.current = false;
    }
  }, [value]);

  function runCommand(command: string) {
    ref.current?.focus();
    if (command.startsWith("formatBlock:")) {
      document.execCommand("formatBlock", false, command.split(":")[1]);
    } else {
      document.execCommand(command, false);
    }
    onChange(ref.current?.innerHTML ?? "");
  }

  return (
    <div className="rounded-[var(--radius-input)] border border-border bg-white overflow-hidden">
      <div className="flex items-center gap-1 border-b border-border bg-[#F5F8FA] px-2 py-1.5">
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.command}
            type="button"
            onClick={() => runCommand(action.command)}
            title={action.label}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-text-secondary hover:bg-white hover:text-text-primary"
          >
            <action.icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
        className={cn(
          "min-h-36 px-3.5 py-2.5 text-sm text-text-primary leading-relaxed focus-visible:outline-none",
          "[&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
          "empty:before:content-[attr(data-placeholder)] empty:before:text-text-muted"
        )}
      />
    </div>
  );
}
