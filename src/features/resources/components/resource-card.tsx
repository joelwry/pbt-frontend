import { FileSpreadsheet, FileText, Video, FileType2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Resource, ResourceFileType } from "@/features/resources/types";

const FILE_TYPE_ICON: Record<ResourceFileType, typeof FileText> = {
  XLSX: FileSpreadsheet,
  PDF: FileText,
  MP4: Video,
  DOCX: FileType2,
};

const FILE_TYPE_COLOR: Record<ResourceFileType, string> = {
  XLSX: "bg-sky-tint text-sky-600",
  PDF: "bg-orange-tint text-orange-500",
  MP4: "bg-[#F1F5F9] text-slate-500",
  DOCX: "bg-sky-tint text-sky-600",
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const Icon = FILE_TYPE_ICON[resource.fileType];

  return (
    <Card className="pbt-hover-lift h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${FILE_TYPE_COLOR[resource.fileType]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <Badge variant="outline">{resource.fileType}</Badge>
      </div>
      <p className="font-semibold text-text-primary text-sm mt-4 leading-snug flex-1">{resource.title}</p>
      <p className="text-xs text-text-muted mt-1.5">{resource.metaLabel}</p>
      <Button variant="secondary" size="sm" className="w-full mt-4" asChild>
        <a href={resource.downloadUrl} download>
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
      </Button>
    </Card>
  );
}
