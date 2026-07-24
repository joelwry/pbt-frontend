import type { ApiSuccess } from "@/types/api";
import type { AdminResource, AdminResourcesStats } from "@/features/admin-resources/types";

export const adminResourcesStatsMock: ApiSuccess<AdminResourcesStats> = {
  success: true,
  message: "Resource stats retrieved successfully",
  data: { publishedTotal: 86, totalDownloadsLabel: "12.4k", draftsCount: 3, topCategoryLabel: "Webinars" },
};

export const adminResourcesMock: AdminResource[] = [
  { id: "res_1", title: "Deal Comparables Spreadsheet", category: "Template", fileType: "XLSX", engagementLabel: "2.4k downloads", status: "Published", description: "A ready-to-use spreadsheet for comparing deals side by side, with built-in yield and ROI formulas.", visibility: "all" },
  { id: "res_2", title: "HMO Licensing Checklist", category: "Guide", fileType: "PDF", engagementLabel: "1.8k downloads", status: "Published", description: "Everything you need to check before submitting an HMO licence application.", visibility: "all" },
  { id: "res_3", title: "Refinancing Masterclass Replay", category: "Webinar", fileType: "MP4", engagementLabel: "980 downloads", status: "Published", description: "Full replay of the live refinancing masterclass, covering timing and lender criteria.", visibility: "plus-mentorship" },
  { id: "res_4", title: "2026 Q3 Deal Sourcing Toolkit", category: "Toolkit", fileType: "ZIP", engagementLabel: "New", status: "Draft", description: "Comparables templates, an updated HMO checklist, and three new case studies from PBT Leaders across the North West.", visibility: "all" },
  { id: "res_5", title: "Investment Goal Planner", category: "Template", fileType: "XLSX", engagementLabel: "1.2k downloads", status: "Published", description: "An interactive planner to set your target income, timeline and risk tolerance.", visibility: "all" },
  { id: "res_6", title: "Joint Venture Agreement Template", category: "Template", fileType: "DOCX", engagementLabel: "740 downloads", status: "Published", description: "A legally-reviewed JV agreement template covering profit split, exit and dispute resolution.", visibility: "plus-mentorship" },
  { id: "res_7", title: "Sourcing Off-Market Deals", category: "Webinar", fileType: "MP4", engagementLabel: "1.1k downloads", status: "Published", description: "A recorded session on direct-to-vendor outreach and building agent relationships.", visibility: "all" },
  { id: "res_8", title: "Landlord Compliance Guide 2026", category: "Guide", fileType: "PDF", engagementLabel: "2.1k downloads", status: "Published", description: "The latest compliance requirements for landlords across England and Wales.", visibility: "all" },
  { id: "res_9", title: "Article 4 Direction Area Map", category: "Guide", fileType: "PDF", engagementLabel: "630 downloads", status: "Published", description: "An updated map of Article 4 direction areas following recent council announcements.", visibility: "all" },
  { id: "res_10", title: "Rent-to-Rent Agreement Template", category: "Template", fileType: "DOCX", engagementLabel: "410 downloads", status: "Draft", description: "A starting-point agreement template for rent-to-rent HMO arrangements.", visibility: "mentorship" },
  { id: "res_11", title: "Portfolio Stress-Test Toolkit", category: "Toolkit", fileType: "XLSX", engagementLabel: "890 downloads", status: "Published", description: "Model rate shocks against your portfolio before committing to a new fixed term.", visibility: "plus-mentorship" },
  { id: "res_12", title: "First HMO Walkthrough", category: "Webinar", fileType: "MP4", engagementLabel: "560 downloads", status: "Published", description: "A walkthrough of a real first-time HMO conversion project, start to finish.", visibility: "all" },
  { id: "res_13", title: "Bridging Finance Cheat Sheet", category: "Toolkit", fileType: "PDF", engagementLabel: "1.5k downloads", status: "Published", description: "Typical bridging rates, fees, and exit strategies lenders expect to see.", visibility: "all" },
  { id: "res_14", title: "Q4 Planning Webinar", category: "Webinar", fileType: "MP4", engagementLabel: "New", status: "Draft", description: "A session on setting realistic Q4 acquisition and refinance targets.", visibility: "all" },
];
