import { z } from "zod";

const firstName = z
  .string()
  .trim()
  .min(1, "Enter your first name")
  .max(40, "That name looks too long")
  .regex(/^[A-Za-z][A-Za-z .'-]*$/, "Letters, spaces, and . ' - only");

const lastName = z
  .string()
  .trim()
  .min(1, "Enter your last name")
  .max(40, "That name looks too long")
  .regex(/^[A-Za-z][A-Za-z .'-]*$/, "Letters, spaces, and . ' - only");

// 10 Indian mobile digits, stored without the +91 prefix.
const phone = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

/** Step 1 — name only. */
export const nameSchema = z.object({ firstName, lastName });
export type NameInput = z.infer<typeof nameSchema>;

/** Phone step — number only. */
export const phoneSchema = z.object({ phone });
export type PhoneInput = z.infer<typeof phoneSchema>;

/** OTP verify — phone + 6-digit code. */
export const otpVerifySchema = z.object({
  phone,
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
});
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;

/** Full lead payload written to the DB (deduped on phone). */
export const leadSchema = z.object({ firstName, lastName, phone });
export type LeadInput = z.infer<typeof leadSchema>;

/** Rank computation payload — assets are recomputed server-side. */
const amountMap = z.record(z.string(), z.number().nonnegative()).default({});
export const rankSchema = z.object({
  assets: amountMap,
  leadId: z.number().int().nullable().optional(),
});
export type RankInput = z.infer<typeof rankSchema>;
