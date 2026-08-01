import { z } from "zod";

export const joinSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  tier: z.enum(["Pathway", "Plus", "Mentorship"]),
  billingCycle: z.enum(["monthly", "annual"]),
});

export type JoinFormValues = z.infer<typeof joinSchema>;
