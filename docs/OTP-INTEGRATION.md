# OTP Integration Handoff — India Wealth Ranker → dakiya

How to switch the "verify" step from mock OTP to real SMS via dakiya. The app
code is done; this is the config work on the dakiya + infra side.

## Division of responsibility

- **The app (India Wealth Ranker)** owns the OTP lifecycle: it generates the
  6-digit code, stores it **hashed** (sha256, phone-bound) in Postgres with a
  5-minute expiry, attempt cap, and send rate-limits, and verifies it.
- **dakiya** is delivery only: it receives the code as a param, renders the
  registered DLT template, and sends via Times (Smartping) using the OTP
  credentials. It does **not** generate or verify codes.

## What the app sends dakiya

`POST {DAKIYA_URL}/communication/send`, JSON body:

```json
{
  "channel": "COMMUNICATION_CHANNEL_SMS",
  "type": "OTP",
  "templateId": "<DLT content template id>",
  "params": { "otp": "123456" },
  "userDetails": { "mobileNumber": "+919876543210" }
}
```

- `type: "OTP"` → routes `TimesClient` to the OTP creds (`times.api.otp.*`).
- `params.otp` fills the `{{otp}}` placeholder (dakiya's `TemplateService`
  replaces `{{key}}` from the stored template body).
- The param key is configurable app-side via `OTP_TEMPLATE_PARAM` (default
  `otp`) — set it to match the placeholder in the registered template.

## Tech team to-do

### 1. Register the OTP template in dakiya (`sms_config`)
Add/activate an `SMSConfig` row:
- `dltTemplateId` = the DLT content template id (from the DLT portal)
- `body` = `{{otp}} is your BondScanner OTP to verify your mobile number. Valid for 5 minutes. Do not share it with anyone.`
- `status` = `ACTIVE`

Also confirm:
- `sms.sender` matches the DLT-approved header/sender ID (e.g. `BONDSC`)
- `sms.vendors` includes `times`, and `times.api.url` + `times.api.otp.username`/`times.api.otp.password` are set

### 2. Reachability + auth
- The app's server must reach `DAKIYA_URL` server-to-server. dakiya is internal,
  so this works once the app runs on/behind BondScanner infra. On the current
  standalone Vercel deploy it likely can't reach internal dakiya → keep mock
  there.
- **Auth:** the app sends `Authorization: Bearer <DAKIYA_API_KEY>` **if** that
  env is set. If `/communication/send` uses a different scheme (custom header,
  gateway key, or IP allowlist / no auth internally), tell us — it's a one-line
  change in `lib/otp/sender.ts`.

### 3. Set env vars on the app
```
OTP_DRIVER=dakiya
DAKIYA_URL=<dakiya base url>
DAKIYA_API_KEY=<only if /communication/send needs it>
OTP_TEMPLATE_ID=<DLT content template id>
OTP_TEMPLATE_PARAM=otp
```
Leaving `OTP_DRIVER` unset (or `=mock`) keeps the mock sender.

**Where to set them** — these are server-side vars read at runtime by the API
routes (not `NEXT_PUBLIC_`), so they go in the hosting platform's env/secret
config, never in the repo:
- Local dev → `.env.local`
- Vercel → Project Settings → Environment Variables
- BondScanner infra → that platform's secret/env manager for the Next.js service

`OTP_DRIVER=dakiya` only works where the server can reach `DAKIYA_URL`. dakiya is
internal, so the real go-live environment is **BondScanner infra**. On the public
Vercel deploy, keep `OTP_DRIVER=mock`.

### 4. Test
- **Mock** (`OTP_DRIVER=mock`): `/api/otp/send` returns the code in the JSON
  response for testing; no SMS is sent.
- **dakiya**: set the envs, redeploy, run the verify step with a real number,
  confirm the SMS arrives and verifies.

## App API reference (for context)
- `POST /api/otp/send` `{ phone }` → generates, stores, dispatches. Rate-limited
  (30s resend cooldown, 5/hour). Returns `{ ok, cooldownSec }` (plus `devCode`
  only on the mock driver).
- `POST /api/otp/verify` `{ phone, code }` → `{ verified: true | false }`.
  5-minute expiry, max 5 attempts, constant-time compare.

## What we need back
1. The DLT **content template id** → `OTP_TEMPLATE_ID`.
2. The **auth scheme** for `/communication/send` (Bearer? custom header? internal/none?).
3. Confirm the template placeholder key (we assume `{{otp}}`).
