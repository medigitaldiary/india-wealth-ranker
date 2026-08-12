import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { otpVerifySchema } from "@/lib/validation/schemas";
import { getDb, hasDatabase } from "@/lib/db/client";
import { otpVerifications } from "@/lib/db/schema";
import { codeMatches, OTP_MAX_ATTEMPTS } from "@/lib/otp/code";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = otpVerifySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const phone = `+91${parsed.data.phone}`;
  const { code } = parsed.data;

  // No DB (local dev) → accept the fixed dev code.
  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, verified: code === "0000" });
  }

  const db = getDb();

  const [row] = await db
    .select()
    .from(otpVerifications)
    .where(and(eq(otpVerifications.phone, phone), eq(otpVerifications.consumed, false)))
    .orderBy(desc(otpVerifications.createdAt))
    .limit(1);

  if (!row) {
    return NextResponse.json({ ok: true, verified: false, error: "expired" });
  }
  if (row.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ ok: true, verified: false, error: "expired" });
  }
  if (row.attempts >= OTP_MAX_ATTEMPTS) {
    return NextResponse.json({ ok: true, verified: false, error: "too_many" });
  }

  await db
    .update(otpVerifications)
    .set({ attempts: row.attempts + 1 })
    .where(eq(otpVerifications.id, row.id));

  if (codeMatches(phone, code, row.codeHash)) {
    await db
      .update(otpVerifications)
      .set({ consumed: true })
      .where(eq(otpVerifications.id, row.id));
    return NextResponse.json({ ok: true, verified: true });
  }

  return NextResponse.json({
    ok: true,
    verified: false,
    error: "incorrect",
    attemptsLeft: Math.max(0, OTP_MAX_ATTEMPTS - (row.attempts + 1)),
  });
}
