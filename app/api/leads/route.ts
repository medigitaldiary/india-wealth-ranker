import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation/schemas";
import { getDb, hasDatabase } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { withCors, corsPreflight } from "@/lib/http/cors";

// Called cross-origin from bondscanner.com/wealth-air (hybrid setup).
export function OPTIONS(req: Request) {
  return corsPreflight(req);
}

export async function POST(req: Request) {
  return withCors(req, await handlePost(req));
}

/**
 * Lead capture (phone step). Validates server-side, then upserts on phone so a
 * repeat visitor updates their existing row. When DATABASE_URL is absent it
 * accepts the lead without persisting so the flow still advances.
 */
async function handlePost(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = leadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const phone = `+91${parsed.data.phone}`;
  const { firstName, lastName } = parsed.data;

  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, id: null, persisted: false });
  }

  try {
    // Called only after OTP verification, so phone_verified is true.
    const [row] = await getDb()
      .insert(leads)
      .values({ firstName, lastName, phone, phoneVerified: true })
      .onConflictDoUpdate({
        target: leads.phone,
        set: { firstName, lastName, phoneVerified: true },
      })
      .returning({ id: leads.id });

    return NextResponse.json({ ok: true, id: row.id, persisted: true });
  } catch (err) {
    console.error("[api/leads] insert failed:", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
