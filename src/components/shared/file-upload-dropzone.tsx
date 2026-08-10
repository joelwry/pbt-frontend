"use client";

import { useState } from "react";
import { UploadCloud, FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileUploadDropzone({
  existingFileName,
  onFileSelected,
}: {
  existingFileName?: string;
  /** Called with the raw File once the user picks or drops one, so a parent can upload it. */
  onFileSelected?: (file: File) => void;
}) {
  const [fileName, setFileName] = useState<string | null>(existingFileName ?? null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (files && files[0]) {
      setFileName(files[0].name);
      onFileSelected?.(files[0]);
    }
  }

  return (
    <div>
      <label
        htmlFor="lesson-file-upload"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors",
          isDragging ? "border-sky-500 bg-sky-tint" : "border-border bg-[#FAFCFD] hover:bg-[#F5F8FA]"
        )}
      >
        {fileName ? (
          <>
            <FileCheck2 className="h-6 w-6 text-sky-600" />
            <p className="text-sm font-semibold text-text-primary">{fileName}</p>
            <p className="text-xs text-text-muted">Click or drop a new file to replace</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-6 w-6 text-text-muted" />
            <p className="text-sm font-semibold text-text-primary">Drag file here or click to upload</p>
            <p className="text-xs text-text-muted">MP4, PDF, DOCX up to 500MB</p>
          </>
        )}
        <input
          id="lesson-file-upload"
          type="file"
          accept=".mp4,.pdf,.docx"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
