/**
 * Pluggable OTP SMS sender. Mirrors dakiya's own vendor-adapter pattern: one
 * interface, swappable drivers chosen by OTP_DRIVER. We own OTP generation and
 * verification; the sender is delivery-only.
 *
 *  - "mock"   : no SMS; the code is returned to the caller for dev/preview.
 *  - "dakiya" : POST to dakiya's /communication/send. dakiya looks up the SMS
 *               template registered under OTP_TEMPLATE_ID (its sms_config), renders
 *               "{{key}}" placeholders from `params`, and sends via its configured
 *               vendor (Times / Smartping) using its OTP credentials.
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

const dakiyaSender: OtpSender = {
  async send(phone, code) {
    const base = process.env.DAKIYA_URL;
    if (!base) throw new Error("DAKIYA_URL is not set");

    // The placeholder key in the registered DLT template, e.g. {{otp}}.
    const paramKey = process.env.OTP_TEMPLATE_PARAM || "otp";

    const res = await fetch(`${base.replace(/\/$/, "")}/communication/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.DAKIYA_API_KEY
          ? { Authorization: `Bearer ${process.env.DAKIYA_API_KEY}` }
          : {}),
      },
      body: JSON.stringify({
        channel: "COMMUNICATION_CHANNEL_SMS",
        type: "OTP", // routes dakiya to the Times/Smartping OTP credentials
        templateId: process.env.OTP_TEMPLATE_ID,
        params: { [paramKey]: code },
        userDetails: { mobileNumber: phone },
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`dakiya send failed: ${res.status} ${detail}`.trim());
    }
  },
};

export function getSender(): OtpSender {
  return getOtpDriver() === "dakiya" ? dakiyaSender : mockSender;
}
