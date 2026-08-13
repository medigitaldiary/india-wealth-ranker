import { NextResponse } from "next/server";

/**
 * CORS for the hybrid setup: the leads + AIR endpoints are called cross-origin
 * from the BondScanner web app (`bondscanner.com/wealth-air`). Browsers enforce
 * this allowlist; it is not an auth boundary (non-browser clients ignore CORS),
 * so rate-limiting/abuse control is handled separately.
 *
 * Extra origins can be added via CORS_ALLOWED_ORIGINS (comma-separated).
 */
const STATIC_ALLOWED = [
  "https://bondscanner.com",
  "https://www.bondscanner.com",
  "http://localhost:3000",
  "http://localhost:3001",
];

function allowedList(): string[] {
  const extra = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...STATIC_ALLOWED, ...extra];
}

function resolveOrigin(origin: string | null): string | null {
  if (!origin) return null;
  if (allowedList().includes(origin)) return origin;
  // Vercel preview deployments (bond-scanner previews) — low-sensitivity endpoints.
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return origin;
  return null;
}

/** Apply CORS headers to a response based on the request Origin. */
export function withCors(req: Request, res: NextResponse): NextResponse {
  const origin = resolveOrigin(req.headers.get("origin"));
  if (origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    res.headers.set("Access-Control-Max-Age", "86400");
  }
  res.headers.set("Vary", "Origin");
  return res;
}

/** Preflight (OPTIONS) response. */
export function corsPreflight(req: Request): NextResponse {
  return withCors(req, new NextResponse(null, { status: 204 }));
}
