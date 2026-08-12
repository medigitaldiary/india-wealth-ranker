/**
 * Pluggable OTP SMS sender. Mirrors dakiya's own vendor-adapter pattern: one
 * interface, swappable drivers chosen by OTP_DRIVER. We own OTP generation and
 * verification; the sender is delivery-only.
 *
 *  - "mock"   : no SMS; the code is returned to the caller for dev/preview.
 *  - "dakiya" : POST to dakiya's /communication/send, which routes to Times
 *               (Smartping) using its OTP credentials + DLT template.
 */
export type OtpDriver = "mock" | "dakiya";

export function getOtpDriver(): OtpDriver {
  return process.env.OTP_DRIVER === "dakiya" ? "dakiya" : "mock";
}

export interface OtpSender {
  send(phone: string, code: string): Promise<void>;
}

const mockSender: OtpSender = {
  async send(phone, code) {
    console.log(`[otp:mock] would send ${code} to ${phone}`);
  },
};

// NOTE: payload shape is provisional until the dakiya details are confirmed
// (channel enum format, exact DLT param key, auth header). Only runs when
// OTP_DRIVER=dakiya, so the mock path is unaffected.
const dakiyaSender: OtpSender = {
  async send(phone, code) {
    const base = process.env.DAKIYA_URL;
    if (!base) throw new Error("DAKIYA_URL is not set");

    const res = await fetch(`${base}/communication/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.DAKIYA_API_KEY
          ? { Authorization: `Bearer ${process.env.DAKIYA_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        channel: "COMMUNICATION_CHANNEL_SMS",
        type: "OTP",
        templateId: process.env.OTP_TEMPLATE_ID,
        params: { otp: code },
        userDetails: { mobileNumber: phone },
      }),
    });

    if (!res.ok) {
      throw new Error(`dakiya send failed: ${res.status}`);
    }
  },
};

export function getSender(): OtpSender {
  return getOtpDriver() === "dakiya" ? dakiyaSender : mockSender;
}
