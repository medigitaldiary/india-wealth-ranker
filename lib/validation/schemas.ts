import { z } from "zod";

/**
 * Lead capture (Level 1). Error messages state the fix, per BondScanner voice
 * ("Enter a valid 10-digit mobile number"), and are surfaced inline — the CTA
 * is never permanently disabled (fix for the prior-audit issue).
 */
export const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(60, "That name looks too long")
    .regex(/^[A-Za-z][A-Za-z .'-]*$/, "Letters, spaces, and . ' - only"),
  // 10 Indian mobile digits, stored without the +91 prefix.
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  // Optional — powers the anonymized "User from <city>" leaderboard handle.
  city: z.string().trim().max(60, "That city name looks too long").optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/**
 * Rank computation payload. Amount maps are recomputed server-side (never trust
 * a client-sent net worth), so the leaderboard stays honest.
 */
const amountMap = z.record(z.string(), z.number().nonnegative()).default({});

export const rankSchema = z.object({
  assets: amountMap,
  liabilities: amountMap,
  leadId: z.number().int().nullable().optional(),
  city: z.string().trim().max(60).optional(),
});

export type RankInput = z.infer<typeof rankSchema>;
