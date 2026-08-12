import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { phoneSchema } from "@/lib/validation/schemas";
import { getDb, hasDatabase } from "@/lib/db/client";
import { otpVerifications } from "@/lib/db/schema";
import {
  generateCode,
  hashCode,
  OTP_TTL_MS,
  OTP_RESEND_COOLDOWN_MS,
  OTP_MAX_SENDS_PER_HOUR,
} from "@/lib/otp/code";
import { getSender, getOtpDriver } from "@/lib/otp/sender";

const cooldownSec = OTP_RESEND_COOLDOWN_MS / 1000;

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = phoneSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const phone = `+91${parsed.data.phone}`;
  const driver = getOtpDriver();

  // No DB (local dev) → fixed dev code, no storage.
  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, cooldownSec, devCode: "0000" });
  }

  const db = getDb();
  const now = Date.now();

  // Rate limiting: resend cooldown + hourly cap.
  const recent = await db
    .select({ createdAt: otpVerifications.createdAt })
    .from(otpVerifications)
    .where(eq(otpVerifications.phone, phone))
    .orderBy(desc(otpVerifications.createdAt))
    .limit(OTP_MAX_SENDS_PER_HOUR + 1);

  if (recent.length) {
    const last = recent[0].createdAt.getTime();
    if (now - last < OTP_RESEND_COOLDOWN_MS) {
      const retryAfterSec = Math.ceil((OTP_RESEND_COOLDOWN_MS - (now - last)) / 1000);
      return NextResponse.json({ error: "cooldown", retryAfterSec }, { status: 429 });
    }
    const inLastHour = recent.filter(
      (r) => r.createdAt.getTime() > now - 3_600_000,
    ).length;
    if (inLastHour >= OTP_MAX_SENDS_PER_HOUR) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
  }

  const code = generateCode();

  // Invalidate any earlier unconsumed codes for this phone, then store the new one.
  await db
    .update(otpVerifications)
    .set({ consumed: true })
    .where(and(eq(otpVerifications.phone, phone), eq(otpVerifications.consumed, false)));

  await db.insert(otpVerifications).values({
    phone,
    codeHash: hashCode(phone, code),
    expiresAt: new Date(now + OTP_TTL_MS),
  });

  try {
    await getSender().send(phone, code);
  } catch (err) {
    console.error("[api/otp/send] delivery failed:", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  // devCode is only exposed on the mock driver, for dev/preview testing.
  return NextResponse.json({
    ok: true,
    cooldownSec,
    ...(driver === "mock" ? { devCode: code } : {}),
  });
}
