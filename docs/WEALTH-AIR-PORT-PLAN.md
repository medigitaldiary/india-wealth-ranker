# Wealth AIR → BondScanner port plan (`bondscanner.com/wealth-air`)

Hand-off plan for moving the **Wealth AIR** funnel (currently the standalone
`india-wealth-ranker` app on Vercel) into the main **BondScanner web app**
(`bond-scanner-v2`), so OTP runs through BondScanner's own dakiya-backed
backend instead of a mock/standalone sender.

## Decisions locked

1. **OTP semantics — reuse the real login.** Verifying the phone OTP goes
   through BondScanner's existing `/v1/auth/phone/*` endpoints, which means a
   successful verify **logs the person into BondScanner** (creates the account,
   returns a session token). Verification *is* the funnel conversion.
2. **Hybrid data model for launch.** The leads pool + AIR ranking **stays on
   the existing standalone Neon API** for launch; only **OTP moves** to
   BondScanner's backend. A later phase migrates leads/AIR onto BondScanner's
   own backend + DB and retires the standalone service.

## Target architecture (launch / hybrid)

Three systems talk to each other:

| System | Owns | Notes |
|---|---|---|
| **`/wealth-air` page** in `bond-scanner-v2` | The UI + funnel state | Pages Router page, built with BondScanner's shadcn UI |
| **BondScanner backend** (`NEXT_PUBLIC_API_BASE_URL`) | OTP send/verify → **dakiya**, account/session | Reused as-is via existing hooks; verify = login |
| **Standalone AIR API** (current `india-wealth-ranker` on Neon) | `leads` table + AIR computation | Retained for launch; called cross-origin from the page |

Flow:
1. User lands on `bondscanner.com/wealth-air`, enters assets (client-only).
2. Enters name + phone → **BondScanner** `request-otp` (dakiya sends the SMS).
3. Enters OTP → **BondScanner** `verify-otp` → session token stored → user is
   now logged into BondScanner.
4. Page POSTs `{ firstName, lastName, phone, assets }` to the **standalone AIR
   API**, which upserts the lead and returns `{ air, totalParticipants,
   totalWealth }`.
5. Reveal screen shows the rank.

## BondScanner stack reference (what already exists)

- **Next.js 15, Pages Router** (`src/pages`), React 19, TypeScript.
- **Tailwind v4 + shadcn/ui** (`src/components/ui/*`) — reusable primitives incl.
  `button`, `input`, `otp-input`, `card`, `drawer`, `skeleton`, `spinner`,
  `label`. Lucide icons. `new-york` style, CSS variables (oklch) in
  `src/styles/globals.css`.
- **Data layer:** `axios` via `NetworkManager.Call({ path, method, data })`
  (`src/NetworkManager`), base URL = `NEXT_PUBLIC_API_BASE_URL`. React Query
  (`@tanstack/react-query`) hooks in `src/hooks/api/*`.
- **State:** React Context (`src/contexts`). No zustand.
- **No database in the repo** — the web app is a pure frontend that proxies to
  the backend. (This is *why* AIR needs either the standalone API or a new
  backend endpoint — the frontend can't own a DB.)
- **Analytics:** Mixpanel + MoEngage already wired.
- **Deploy:** Docker + Vercel Microfrontends + Redis ISR. The marketing MFE only
  owns `/l/*`, `/p/*`, `/contact-us`, `/faqs`, so **`/wealth-air` belongs to the
  main app by default** — no microfrontends.json change needed.

## OTP integration (reuse — do NOT rebuild)

Everything OTP is already there. Use these hooks from
`src/hooks/api/authHooks.ts`:

- `useRequestOTP()` → `POST /v1/auth/phone/request-otp` `{ phone: "+91…" }`
  (the hook's `formatPhone` adds `+91`). Backend generates + sends via dakiya.
- `useVerifyOTP()` → `POST /v1/auth/phone/verify-otp`
  `{ phone, otp, utmRequest }` → `{ token, profile: { userId, phone, email,
  name, newUser } }`.

What `verifyOTPApi` does on success (all handled for us):
- stores `token` / `masterToken` / `name` in `localStorage` → **user is logged in**;
- `mixpanel.alias(userId)` (ties analytics identity);
- reads `utmRequest` from `localStorage` and clears it → **UTM attribution is
  automatic** as long as the site's global UTM capture ran on the landing.

**Important — do not copy the Login component's post-verify behavior.** The
redirect to `/kyc` / onboarding lives in the *Login component*, not in
`useVerifyOTP`. On the wealth-air page: on verify success, **advance to the
reveal step** instead of redirecting. The hook itself does not force navigation.

**Delete from the port entirely** (all replaced by the above): my
`/api/otp/send`, `/api/otp/verify`, `lib/otp/*`, the `otp_verifications` table,
and the dakiya driver. No dakiya code lives in the frontend or the AIR API.

## Leads + AIR (hybrid — keep the standalone Neon API)

Retain the current `india-wealth-ranker` API, stripped down to just leads/AIR:

- **Keep:** `POST /api/leads` (upsert on phone), `POST /api/rank` (AIR =
  `1 + count(participants with more total wealth)`), the Neon `leads` table.
- **Remove:** the OTP routes/lib/table (now BondScanner's backend).
- **Trust boundary:** the page only calls the AIR API *after* BondScanner's
  `verify-otp` succeeds, so the AIR API can treat the phone as verified. Keep
  `phone` on the lead for dedup + the ranking pool.
- **CORS:** the AIR API must allow the `https://bondscanner.com` origin
  (add `Access-Control-Allow-Origin` + preflight handling to the two routes),
  since the page now calls it cross-origin.
- **Config:** page reads the AIR API base from a new env var, e.g.
  `NEXT_PUBLIC_WEALTH_AIR_API_URL`.

## Frontend port task list (in `bond-scanner-v2`)

1. `src/pages/wealth-air/index.tsx` — **single page, internal step state**
   (assets → details+OTP → reveal). Single-page (vs. sub-routes) matches the
   "no persistence, restart each load" behavior and avoids Pages-Router state
   loss between routes.
2. Rebuild the three screens with **shadcn primitives** (`input`, `otp-input`,
   `button`, `card`) + lucide icons + the `motion` package (already a dep) for
   the count-ups/transitions. Port all the copy verbatim from the current app
   (landing → "Add your assets" → "Almost there" merged name+phone+OTP →
   reveal + "Powered by BondScanner" disclaimer).
3. OTP step → `useRequestOTP` / `useVerifyOTP`. On verify success, continue to
   reveal (do not redirect to KYC).
4. Assets + AIR → a small React Query hook (`useSubmitWealthAir`) calling the
   standalone AIR API via `NEXT_PUBLIC_WEALTH_AIR_API_URL`.
5. Carry over the **16px mobile-input fix** — check BondScanner's `input.tsx`
   font-size; if <16px, apply the same touch-device rule to prevent iOS
   focus-zoom.
6. Reveal CTA: since the user is now **logged in** after OTP, the crossell can
   deep-link into their authenticated bonds experience rather than a signup.
7. Analytics: fire Mixpanel/MoEngage events at each step (start, OTP sent,
   verified, rank revealed) using the existing analytics setup.
8. SEO: add `/wealth-air` to `generate-sitemaps.ts`; confirm it renders under
   the main app (it will — not owned by the marketing MFE).

## Dev-team dependencies / confirmations

- **CORS** for `bondscanner.com` on the standalone AIR API routes.
- Confirm `verify-otp` has **no side-effect that force-navigates** in our usage
  (PIN modal is triggered by a 403 interceptor on authed calls — the funnel
  makes no authed BondScanner calls, so it should not fire; verify in staging).
- Ensure the site's **global UTM capture** populates `localStorage.utmRequest`
  on `/wealth-air` so `verify-otp` attributes the lead.
- Decide the **reveal crossell destination** for a now-logged-in user.

## Post-launch migration (retire the hybrid)

Replace the standalone AIR API with a BondScanner backend endpoint, e.g.
`POST /v1/wealth-air/submit` `{ firstName, lastName, phone, assets }` →
`{ air, totalParticipants, totalWealth }`, backed by BondScanner's own DB, gated
by the session token from verify-otp. Then the page drops
`NEXT_PUBLIC_WEALTH_AIR_API_URL` and the Neon service is decommissioned.

## Open questions

- Reveal crossell target for logged-in users (bonds dashboard path?).
- Do we want the AIR pool seeded/scoped (all participants vs. a segment)?
- Rate-limiting on the AIR submit endpoint (the standalone API currently relies
  on the OTP gate; confirm that's sufficient once OTP is upstream).
