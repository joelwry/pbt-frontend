export type ResourceCategory = "Download" | "Template" | "Guide" | "Worksheet" | "Video" | "Checklist" | "Toolkit";
export type ResourceFileType = "XLSX" | "PDF" | "MP4" | "DOCX" | "ZIP";

export interface Resource {
  id: string;
  title: string;
  category: ResourceCategory;
  fileType: ResourceFileType;
  metaLabel: string; // "12 pages", "58 min", "Interactive"
  downloadUrl: string;
}

export interface FeaturedToolkit {
  id: string;
  badgeLabel: string;
  title: string;
  description: string;
  downloadUrl: string;
}
