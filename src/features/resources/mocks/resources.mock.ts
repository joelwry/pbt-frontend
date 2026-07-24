import type { ApiSuccess } from "@/types/api";
import type { Resource, FeaturedToolkit } from "@/features/resources/types";

export const featuredToolkitMock: ApiSuccess<FeaturedToolkit> = {
  success: true,
  message: "Featured toolkit retrieved successfully",
  data: {
    id: "toolkit_q3_2026",
    badgeLabel: "Featured Toolkit",
    title: "2026 Q3 Deal Sourcing Toolkit",
    description: "Comparables templates, HMO checklist, and three new North West case studies.",
    downloadUrl: "https://cdn.pbt.example/toolkits/q3-2026-deal-sourcing.zip",
  },
};

export const resourcesMock: ApiSuccess<Resource[]> = {
  success: true,
  message: "Resources retrieved successfully",
  data: [
    { id: "res_1", title: "Deal Comparables Spreadsheet", category: "Template", fileType: "XLSX", metaLabel: "Template · Updated Jul 2026", downloadUrl: "https://cdn.pbt.example/resources/deal-comparables.xlsx" },
    { id: "res_2", title: "HMO Licensing Checklist", category: "Guide", fileType: "PDF", metaLabel: "Guide · 12 pages", downloadUrl: "https://cdn.pbt.example/resources/hmo-licensing-checklist.pdf" },
    { id: "res_3", title: "Refinancing Masterclass Replay", category: "Webinar", fileType: "MP4", metaLabel: "Webinar · 58 min", downloadUrl: "https://cdn.pbt.example/resources/refinancing-masterclass.mp4" },
    { id: "res_4", title: "Bridging Finance Cheat Sheet", category: "Toolkit", fileType: "PDF", metaLabel: "Toolkit · 6 pages", downloadUrl: "https://cdn.pbt.example/resources/bridging-finance-cheatsheet.pdf" },
    { id: "res_5", title: "Investment Goal Planner", category: "Template", fileType: "XLSX", metaLabel: "Template · Interactive", downloadUrl: "https://cdn.pbt.example/resources/investment-goal-planner.xlsx" },
    { id: "res_6", title: "Joint Venture Agreement Template", category: "Template", fileType: "DOCX", metaLabel: "Template · Legal-reviewed", downloadUrl: "https://cdn.pbt.example/resources/jv-agreement-template.docx" },
    { id: "res_7", title: "Sourcing Off-Market Deals", category: "Webinar", fileType: "MP4", metaLabel: "Webinar · 44 min", downloadUrl: "https://cdn.pbt.example/resources/sourcing-off-market.mp4" },
    { id: "res_8", title: "Landlord Compliance Guide 2026", category: "Guide", fileType: "PDF", metaLabel: "Guide · 20 pages", downloadUrl: "https://cdn.pbt.example/resources/landlord-compliance-2026.pdf" },
    { id: "res_9", title: "Article 4 Direction Area Map", category: "Guide", fileType: "PDF", metaLabel: "Guide · 8 pages", downloadUrl: "https://cdn.pbt.example/resources/article-4-map.pdf" },
    { id: "res_10", title: "Rent-to-Rent Agreement Template", category: "Template", fileType: "DOCX", metaLabel: "Template · Legal-reviewed", downloadUrl: "https://cdn.pbt.example/resources/rent-to-rent-template.docx" },
    { id: "res_11", title: "Portfolio Stress-Test Toolkit", category: "Toolkit", fileType: "XLSX", metaLabel: "Toolkit · Interactive", downloadUrl: "https://cdn.pbt.example/resources/portfolio-stress-test.xlsx" },
    { id: "res_12", title: "First HMO Walkthrough", category: "Webinar", fileType: "MP4", metaLabel: "Webinar · 36 min", downloadUrl: "https://cdn.pbt.example/resources/first-hmo-walkthrough.mp4" },
  ],
};
