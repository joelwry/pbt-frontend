import type { ApiSuccess } from "@/types/api";
import type { AdminPartner, AdminPowerTeamStats } from "@/features/admin-power-team/types";

export const adminPowerTeamStatsMock: ApiSuccess<AdminPowerTeamStats> = {
  success: true,
  message: "Power Team stats retrieved successfully",
  data: { totalPartners: 22, serviceTypesCount: 6, pendingCount: 2, regionsCount: 9 },
};

export const adminPartnersMock: AdminPartner[] = [
  { id: "pt_1", name: "Harrison & Bell LLP", initials: "HB", category: "Solicitors", region: "Manchester", status: "Verified", email: "hello@harrisonbell.example", phone: "0161 496 0110", bio: "Specialist property solicitors handling conveyancing, HMO licensing and portfolio refinances." },
  { id: "pt_2", name: "Northfield Finance", initials: "NF", category: "Mortgage Brokers", region: "Birmingham", status: "Verified", email: "team@northfieldfinance.example", phone: "0121 828 0044", bio: "Whole-of-market mortgage brokers with strong HMO and limited company lender relationships." },
  { id: "pt_3", name: "Clarke & Pierce", initials: "CP", category: "Accountants", region: "London", status: "Verified", email: "info@clarkepierce.example", phone: "020 7946 0022", bio: "Chartered accountants focused on property tax planning and limited company structuring." },
  { id: "pt_4", name: "Sterling Surveyors", initials: "SV", category: "Surveyors", region: "Leeds", status: "Verified", email: "surveys@sterlingsurveyors.example", phone: "0113 350 0099", bio: "RICS-registered surveyors providing valuations and building surveys across Yorkshire." },
  { id: "pt_5", name: "Blackwood Insurance", initials: "BW", category: "Solicitors", region: "Bristol", status: "Verified", email: "cover@blackwoodinsurance.example", phone: "0117 214 0033", bio: "Landlord and HMO insurance specialists." },
  { id: "pt_6", name: "Prime Mortgages Co", initials: "PM", category: "Mortgage Brokers", region: "Glasgow", status: "Pending Review", email: "hello@primemortgagesco.example", phone: "0141 611 0088", bio: "Bridging and development finance specialists supporting refurbishment projects." },
  { id: "pt_7", name: "Ashworth & Reid", initials: "AR", category: "Solicitors", region: "Cardiff", status: "Verified", email: "enquiries@ashworthreid.example", phone: "029 2022 0055", bio: "Commercial and residential property solicitors supporting joint venture agreements." },
  { id: "pt_8", name: "Reed & Co Accountants", initials: "RC", category: "Accountants", region: "Sheffield", status: "Verified", email: "info@reedco.example", phone: "0114 273 0011", bio: "Property-focused accountancy practice offering quarterly reviews." },
  { id: "pt_9", name: "Harborview Surveyors", initials: "HV", category: "Surveyors", region: "Southampton", status: "Pending Review", email: "surveys@harborview.example", phone: "023 8022 0066", bio: "Building surveys and schedules of condition for HMO conversions." },
  { id: "pt_10", name: "Whitfield Mortgages", initials: "WM", category: "Mortgage Brokers", region: "Newcastle", status: "Verified", email: "team@whitfieldmortgages.example", phone: "0191 300 0021", bio: "Specialist finance brokers for first-time landlords." },
  { id: "pt_11", name: "Dalton & Ford Solicitors", initials: "DF", category: "Solicitors", region: "Nottingham", status: "Verified", email: "hello@daltonford.example", phone: "0115 824 0077", bio: "Property solicitors specialising in auction purchases and fast completions." },
  { id: "pt_12", name: "Vantage Accountants", initials: "VA", category: "Accountants", region: "Liverpool", status: "Verified", email: "info@vantageaccountants.example", phone: "0151 236 0055", bio: "MTD-compliant bookkeeping and tax planning for property investors." },
];
