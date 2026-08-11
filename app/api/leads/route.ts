import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation/schemas";
import { getDb, hasDatabase } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";

/**
 * Level 1 lead capture. Validates server-side (never trust the client), then
 * inserts into the Neon `leads` table. When DATABASE_URL is absent (local dev
 * before Neon is wired) it returns ok with id:null and persisted:false so the
 * quest flow still advances.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const phone = `+91${parsed.data.phone}`;

  // No DB configured yet — accept the lead but don't persist.
  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, id: null, persisted: false });
  }

  try {
    const [row] = await getDb()
      .insert(leads)
      .values({
        fullName: parsed.data.fullName,
        phone,
        city: parsed.data.city ?? null,
        tier: "rising-aspirant", // entry tier awarded at lead capture
      })
      .returning({ id: leads.id });

    return NextResponse.json({ ok: true, id: row.id, persisted: true });
  } catch (err) {
    console.error("[api/leads] insert failed:", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
