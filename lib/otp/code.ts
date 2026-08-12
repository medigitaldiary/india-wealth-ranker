import { createHash, randomInt, timingSafeEqual } from "crypto";

/** 6-digit numeric OTP, zero-padded. */
export function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** Codes are stored hashed (bound to the phone), never in plaintext. */
export function hashCode(phone: string, code: string): string {
  return createHash("sha256").update(`${phone}:${code}`).digest("hex");
}

/** Constant-time comparison of a submitted code against a stored hash. */
export function codeMatches(phone: string, code: string, hash: string): boolean {
  const a = Buffer.from(hashCode(phone, code));
  const b = Buffer.from(hash);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000; // 30s
export const OTP_MAX_SENDS_PER_HOUR = 5;
