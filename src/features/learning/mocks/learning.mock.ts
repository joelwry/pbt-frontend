import type { ApiSuccess } from "@/types/api";
import type { YearOption, YearProgramme, Lesson, ModuleBadge } from "@/features/learning/types";

export const learningYearsMock: ApiSuccess<YearOption[]> = {
  success: true,
  message: "Learning years retrieved successfully",
  data: [
    { year: "2024", label: "2024", isCurrent: false },
    { year: "2025", label: "2025", isCurrent: false },
    { year: "2026", label: "2026 · Current", isCurrent: true },
  ],
};

const foundationsLessons: Lesson[] = [
  {
    id: "l_2026_m1",
    moduleId: "mod_foundations",
    month: 1,
    category: "MONTH 1",
    title: "Property Investment Mindset",
    type: "Video",
    author: "T. Grant",
    metaLabel: "24 min",
    progressPercent: 100,
    status: "completed",
    access: { unlocksAt: "2026-01-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "video",
      videoUrl: "https://cdn.pbt.example/videos/investment-mindset.mp4",
      durationLabel: "24 min",
      transcript:
        "An introduction to thinking like a property investor rather than a homeowner, covering risk appetite, time horizon and the mindset shifts needed before your first deal.",
    },
  },
  {
    id: "l_2026_m2",
    moduleId: "mod_foundations",
    month: 2,
    category: "MONTH 2",
    title: "Reading the UK Market — Guide",
    type: "Article",
    author: "T. Grant",
    metaLabel: "11 min read",
    progressPercent: 100,
    status: "completed",
    access: { unlocksAt: "2026-02-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "article",
      readTimeLabel: "11 min read",
      html:
        "<p>A practical guide to reading UK regional property markets — supply and demand signals, rental yield benchmarks, and how to spot areas entering a growth cycle.</p>",
    },
  },
  {
    id: "l_2026_m3",
    moduleId: "mod_foundations",
    month: 3,
    category: "MONTH 3",
    title: "Setting Investment Goals",
    type: "PDF",
    author: "M. Adeyemi",
    metaLabel: "6-page workbook",
    progressPercent: 100,
    status: "completed",
    access: { unlocksAt: "2026-03-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "pdf",
      pageCountLabel: "6-page workbook",
      fileUrl: "https://cdn.pbt.example/pdf/investment-goals-workbook.pdf",
      summary: "A worksheet to define your target income, timeline and acceptable risk before you buy.",
    },
  },
  {
    id: "l_2026_m4",
    moduleId: "mod_foundations",
    month: 4,
    category: "MONTH 4",
    title: "Building Your Buy Box — Check",
    type: "Quiz",
    author: "S. Bello",
    metaLabel: "8 questions",
    progressPercent: 100,
    status: "completed",
    access: { unlocksAt: "2026-04-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "quiz",
      questionCount: 8,
      questions: [
        {
          id: "q1",
          question: "Which of these best defines a 'buy box'?",
          options: [
            "A storage unit for paperwork",
            "The set of criteria that define your ideal investment property",
            "A type of mortgage product",
            "A show-home display",
          ],
          correctIndex: 1,
        },
        {
          id: "q2",
          question: "Why should you set a buy box before viewing properties?",
          options: [
            "It's required by law",
            "It speeds up mortgage approval",
            "It keeps you focused and avoids emotional decisions",
            "It's not necessary if you have cash",
          ],
          correctIndex: 2,
        },
      ],
    },
  },
  {
    id: "l_2026_m5",
    moduleId: "mod_foundations",
    month: 5,
    category: "BONUS CONTENT",
    title: "Legal Structures for Investors",
    type: "PDF",
    author: "T. Grant",
    metaLabel: "5-page guide",
    progressPercent: 100,
    status: "completed",
    access: { unlocksAt: "2026-04-20T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "pdf",
      pageCountLabel: "5-page guide",
      fileUrl: "https://cdn.pbt.example/pdf/legal-structures.pdf",
      summary: "Sole name vs limited company vs LLP — the pros, cons and tax implications of each structure.",
    },
  },
];

const dealStructuringLessons: Lesson[] = [
  {
    id: "l_2026_m8",
    moduleId: "mod_deal_structuring",
    month: 8,
    category: "MONTH 8",
    title: "Creative Finance Options",
    type: "Video",
    author: "S. Bello",
    metaLabel: "38 min",
    progressPercent: 100,
    status: "completed",
    access: { unlocksAt: "2026-06-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "video",
      videoUrl: "https://cdn.pbt.example/videos/creative-finance.mp4",
      durationLabel: "38 min",
      transcript: "An overview of vendor finance, lease options and other structures beyond a standard mortgage.",
    },
  },
  {
    id: "l_2026_m9",
    moduleId: "mod_deal_structuring",
    month: 9,
    category: "MONTH 9",
    title: "Negotiating Below-Market Offers",
    type: "Video",
    author: "M. Adeyemi",
    metaLabel: "32 min",
    progressPercent: 74,
    status: "in-progress",
    access: { unlocksAt: "2026-07-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "video",
      videoUrl: "https://cdn.pbt.example/videos/negotiating-below-market.mp4",
      durationLabel: "32 min",
      transcript:
        "How to identify motivated sellers, structure a below-market offer, and negotiate without damaging the relationship.",
    },
  },
  {
    id: "l_2026_m10",
    moduleId: "mod_deal_structuring",
    month: 10,
    category: "MONTH 10",
    title: "Bridging Loans Explained — Reading Guide",
    type: "Article",
    author: "S. Bello",
    metaLabel: "8 min read",
    progressPercent: 18,
    status: "in-progress",
    access: { unlocksAt: "2026-07-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "article",
      readTimeLabel: "8 min read",
      html: "<p>What bridging finance is, when it makes sense, typical rates and fees, and the exit strategies lenders expect to see.</p>",
    },
  },
  {
    id: "l_2026_m11",
    moduleId: "mod_deal_structuring",
    month: 11,
    category: "MONTH 11",
    title: "Joint Venture Structures — Template",
    type: "PDF",
    author: "T. Grant",
    metaLabel: "4-page template",
    progressPercent: 0,
    status: "not-started",
    access: { unlocksAt: "2026-08-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "pdf",
      pageCountLabel: "4-page template",
      fileUrl: "https://cdn.pbt.example/pdf/jv-structure-template.pdf",
      summary: "A ready-to-adapt joint venture agreement template covering profit split, exit and dispute resolution.",
    },
  },
  {
    id: "l_2026_m12",
    moduleId: "mod_deal_structuring",
    month: 12,
    category: "BONUS CONTENT",
    title: "Refinancing Strategy Deep-Dive",
    type: "Video",
    author: "M. Adeyemi",
    metaLabel: "41 min",
    progressPercent: 0,
    status: "not-started",
    access: { unlocksAt: "2026-07-01T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "video",
      videoUrl: "https://cdn.pbt.example/videos/refinancing-deep-dive.mp4",
      durationLabel: "41 min",
      transcript: "A deeper look at refinance timing, lender criteria and stress-testing your portfolio before you pull equity out.",
    },
  },
];

const portfolioGrowthLessons: Lesson[] = [
  {
    id: "l_2026_m13",
    moduleId: "mod_portfolio_growth",
    month: 13,
    category: "MONTH 13",
    title: "Refinancing to Release Equity",
    type: "Video",
    author: "M. Adeyemi",
    metaLabel: "29 min",
    progressPercent: 0,
    status: "locked",
    access: { unlocksAt: "2026-09-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "video",
      videoUrl: "https://cdn.pbt.example/videos/refinancing-equity.mp4",
      durationLabel: "29 min",
      transcript: "Locked until release.",
    },
  },
  {
    id: "l_2026_m14",
    moduleId: "mod_portfolio_growth",
    month: 14,
    category: "MONTH 14",
    title: "Scaling From 1 to 10 Units",
    type: "Video",
    author: "M. Adeyemi",
    metaLabel: "55 min",
    progressPercent: 0,
    status: "locked",
    access: { unlocksAt: "2026-10-05T00:00:00Z", requiredTier: "Plus" },
    body: {
      kind: "video",
      videoUrl: "https://cdn.pbt.example/videos/scaling-units.mp4",
      durationLabel: "55 min",
      transcript: "Locked until release.",
    },
  },
];

const pathway2025Lessons: Lesson[] = [
  {
    id: "l_2025_m1",
    moduleId: "mod_2025_pathway",
    month: 1,
    category: "MONTH 1",
    title: "Getting Started on the PBT Pathway",
    type: "Video",
    author: "T. Grant",
    metaLabel: "19 min",
    progressPercent: 100,
    status: "completed",
    access: { unlocksAt: "2025-01-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "video",
      videoUrl: "https://cdn.pbt.example/videos/pathway-getting-started.mp4",
      durationLabel: "19 min",
      transcript: "An orientation to the Pathway programme structure and how content unlocks each month.",
    },
  },
];

const intro2024Lessons: Lesson[] = [
  {
    id: "l_2024_m1",
    moduleId: "mod_2024_intro",
    month: 1,
    category: "MONTH 1",
    title: "Welcome to Property Business Training",
    type: "Video",
    author: "T. Grant",
    metaLabel: "14 min",
    progressPercent: 100,
    status: "completed",
    access: { unlocksAt: "2024-01-05T00:00:00Z", requiredTier: "Pathway" },
    body: {
      kind: "video",
      videoUrl: "https://cdn.pbt.example/videos/welcome.mp4",
      durationLabel: "14 min",
      transcript: "A welcome message outlining what to expect across your first year.",
    },
  },
];

/** Single source of truth for lesson data, keyed by module id. */
export const lessonsByModuleId: Record<string, Lesson[]> = {
  mod_foundations: foundationsLessons,
  mod_deal_structuring: dealStructuringLessons,
  mod_portfolio_growth: portfolioGrowthLessons,
  mod_2025_pathway: pathway2025Lessons,
  mod_2024_intro: intro2024Lessons,
};

interface ModuleMeta {
  moduleNumber: number;
  title: string;
  badge: ModuleBadge;
}

const moduleMeta: Record<string, ModuleMeta> = {
  mod_foundations: { moduleNumber: 1, title: "Foundations of Property Investing", badge: { kind: "complete" } },
  mod_deal_structuring: { moduleNumber: 2, title: "Deal Structuring & Finance", badge: { kind: "progress", label: "Month 9 of 12" } },
  mod_portfolio_growth: { moduleNumber: 3, title: "Portfolio Growth & Scaling", badge: null },
  mod_2025_pathway: { moduleNumber: 1, title: "Pathway Fundamentals", badge: { kind: "complete" } },
  mod_2024_intro: { moduleNumber: 1, title: "Property Business Foundations", badge: { kind: "complete" } },
};

function moduleSummary(moduleId: string) {
  const meta = moduleMeta[moduleId];
  return {
    id: moduleId,
    moduleNumber: meta.moduleNumber,
    title: meta.title,
    badge: meta.badge,
    lessonCount: lessonsByModuleId[moduleId]?.length ?? 0,
  };
}

export const yearModuleIds: Record<string, string[]> = {
  "2026": ["mod_foundations", "mod_deal_structuring", "mod_portfolio_growth"],
  "2025": ["mod_2025_pathway"],
  "2024": ["mod_2024_intro"],
};

export const yearProgrammeMocks: Record<string, ApiSuccess<YearProgramme>> = {
  "2026": {
    success: true,
    message: "Programme retrieved successfully",
    data: {
      year: "2026",
      label: "2026 Programme — Ongoing Membership",
      isCurrent: true,
      overallPercent: 62,
      note:
        "There's no fixed 12-month end date. New months unlock automatically as they're released, and every programme you've subscribed to stays available under the year selector above.",
      continueWhereLeftOff: [
        dealStructuringLessons[1], // Negotiating Below-Market Offers
        dealStructuringLessons[2], // Bridging Loans Explained
        portfolioGrowthLessons[1], // Scaling From 1 to 10 Units (locked)
        foundationsLessons[3], // Understanding buy box quiz
      ],
      modules: yearModuleIds["2026"].map(moduleSummary),
    },
  },
  "2025": {
    success: true,
    message: "Programme retrieved successfully",
    data: {
      year: "2025",
      label: "2025 Programme — Completed",
      isCurrent: false,
      overallPercent: 100,
      note: "You completed every month released in 2025. This programme remains available to revisit any time.",
      continueWhereLeftOff: [],
      modules: yearModuleIds["2025"].map(moduleSummary),
    },
  },
  "2024": {
    success: true,
    message: "Programme retrieved successfully",
    data: {
      year: "2024",
      label: "2024 Programme — Completed",
      isCurrent: false,
      overallPercent: 100,
      note: "Your first year on the programme — fully completed.",
      continueWhereLeftOff: [],
      modules: yearModuleIds["2024"].map(moduleSummary),
    },
  },
};
