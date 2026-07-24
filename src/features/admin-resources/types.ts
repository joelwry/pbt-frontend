export type AdminResourceCategory = "Template" | "Guide" | "Webinar" | "Toolkit";
export type AdminResourceFileType = "XLSX" | "PDF" | "MP4" | "DOCX" | "ZIP";
export type AdminResourceStatus = "Published" | "Draft";
export type ResourceVisibility = "all" | "plus-mentorship" | "mentorship";

export interface AdminResource {
  id: string;
  title: string;
  category: AdminResourceCategory;
  fileType: AdminResourceFileType;
  engagementLabel: string; // "2.4k downloads" or "New"
  status: AdminResourceStatus;
  description: string;
  visibility: ResourceVisibility;
}

export interface AdminResourcesStats {
  publishedTotal: number;
  totalDownloadsLabel: string;
  draftsCount: number;
  topCategoryLabel: string;
}
