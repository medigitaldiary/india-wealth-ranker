import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, gt, count, isNotNull } from "drizzle-orm";
import { getDb, hasDatabase } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { withCors, corsPreflight } from "@/lib/http/cors";

/**
 * "Have you played before?" — look up an existing participant by phone and
 * return their stored rank, so a logged-in repeat user can be shown their AIR
 * straight away without re-entering assets. Returns { exists: false } when the
 * phone has no completed entry.
 *
 * Called cross-origin from bondscanner.com/wealth-air.
 */
const lookupSchema = z.object({ phone: z.string().min(1) });

export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  return withCors(req, await handlePost(req));
}

async function handlePost(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = lookupSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }

  // Normalise to the stored format (+91XXXXXXXXXX).
  const digits = parsed.data.phone.replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return NextResponse.json({ exists: false });
  const phone = `+91${digits}`;

  if (!hasDatabase()) return NextResponse.json({ exists: false });

  try {
    const db = getDb();
    const [lead] = await db
      .select({
        firstName: leads.firstName,
        lastName: leads.lastName,
        wealth: leads.totalWealthInr,
      })
      .from(leads)
      .where(eq(leads.phone, phone))
      .limit(1);

    // No row, or they never completed a ranking (no stored wealth).
    if (!lead || lead.wealth == null) {
      return NextResponse.json({ exists: false });
    }

    const wealth = Number(lead.wealth);
    const [{ ahead }] = await db
      .select({ ahead: count() })
      .from(leads)
      .where(gt(leads.totalWealthInr, wealth));
    const [{ total }] = await db
      .select({ total: count() })
      .from(leads)
      .where(isNotNull(leads.totalWealthInr));

    return NextResponse.json({
      exists: true,
      air: ahead + 1,
      totalParticipants: total,
      totalWealth: wealth,
      firstName: lead.firstName,
      lastName: lead.lastName,
    });
  } catch (err) {
    console.error("[api/lookup] failed:", err);
    return NextResponse.json({ exists: false });
  }
}
