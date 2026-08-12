"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/bondscanner/forms/Input";
import { Button } from "@/components/bondscanner/core/Button";
import { OtpInput } from "./OtpInput";
import { phoneSchema, type PhoneInput } from "@/lib/validation/schemas";
import { useQuestStore } from "@/lib/store/questStore";
import { useHydrated } from "@/lib/hooks/useHydrated";

export function PhoneForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const firstName = useQuestStore((s) => s.firstName);
  const lastName = useQuestStore((s) => s.lastName);
  const highestLevel = useQuestStore((s) => s.highestLevel);
  const setLead = useQuestStore((s) => s.setLead);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  const [stage, setStage] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  // Funnel guard.
  useEffect(() => {
    if (hydrated && (!firstName || highestLevel < 2)) router.replace("/rank");
  }, [hydrated, firstName, highestLevel, router]);

  // Resend cooldown countdown.
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const { control, handleSubmit } = useForm<PhoneInput>({
    resolver: zodResolver(phoneSchema),
    mode: "onTouched",
    defaultValues: { phone: "" },
  });

  if (!hydrated) return null;

  const sendOtp = async (num: string) => {
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: num }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          json.error === "cooldown"
            ? `Please wait ${json.retryAfterSec ?? 30}s before resending.`
            : json.error === "rate_limited"
              ? "Too many requests. Please try again later."
              : "Couldn't send the code. Please try again.",
        );
        setSending(false);
        return;
      }
      setPhone(num);
      setDevCode(json.devCode ?? null);
      setResendIn(json.cooldownSec ?? 30);
      setCode("");
      setStage("code");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const verify = async (fullCode: string) => {
    if (fullCode.length !== 4 || verifying) return;
    setError(null);
    setVerifying(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: fullCode }),
      });
      const json = await res.json().catch(() => ({}));
      if (!json.verified) {
        setError(
          json.error === "expired"
            ? "That code expired — resend a new one."
            : json.error === "too_many"
              ? "Too many attempts — resend a new code."
              : "Incorrect code. Please try again.",
        );
        setCode("");
        setVerifying(false);
        return;
      }
      // Verified — capture the lead, then reveal.
      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      const leadJson = leadRes.ok ? await leadRes.json() : { id: null };
      setLead({ leadId: leadJson.id ?? null, phone: `+91${phone}`, phoneVerified: true });
      reachLevel(3);
      router.push("/rank/reveal");
    } catch {
      setError("Network error. Please try again.");
      setVerifying(false);
    }
  };

  const errorBox = error && (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-[var(--r-10)] px-3 py-2.5"
      style={{
        background: "var(--state-error-lighter)",
        color: "var(--state-error-base)",
        fontSize: "var(--body-sm-size)",
        lineHeight: "var(--body-sm-line)",
      }}
    >
      <i className="ri-error-warning-line mt-0.5" aria-hidden />
      <span>{error}</span>
    </div>
  );

  if (stage === "phone") {
    return (
      <form onSubmit={handleSubmit((d) => sendOtp(d.phone))} noValidate className="flex flex-col gap-5">
        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <Input
              label="Mobile number"
              required
              size="lg"
              inputMode="numeric"
              maxLength={10}
              placeholder="98765 43210"
              leadingIcon={
                <span className="num text-text-body" style={{ fontWeight: 500 }}>
                  +91
                </span>
              }
              autoComplete="tel-national"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))}
              onBlur={field.onBlur}
              name={field.name}
              error={!!fieldState.error}
              hint={fieldState.error?.message ?? "We'll text you a 4-digit code."}
            />
          )}
        />
        {errorBox}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={sending}
          trailingIcon={!sending && <i className="ri-arrow-right-line text-lg" aria-hidden />}
        >
          {sending ? "Sending…" : "Send OTP"}
        </Button>
        <p
          className="text-center text-text-muted"
          style={{ fontSize: "var(--body-xs-size)", lineHeight: "var(--body-xs-line)" }}
        >
          <i className="ri-lock-2-line" aria-hidden /> Private · we only use this to
          send your rank.
        </p>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-center text-text-body" style={{ fontSize: "var(--body-sm-size)" }}>
        Enter the code sent to{" "}
        <span className="num text-text-title" style={{ fontWeight: 600 }}>
          +91 {phone}
        </span>
      </p>

      <OtpInput
        value={code}
        onChange={setCode}
        onComplete={(c) => verify(c)}
        disabled={verifying}
        error={!!error}
      />

      {devCode && (
        <p
          className="text-center num"
          style={{ fontSize: "var(--body-xs-size)", color: "var(--brand-accent)" }}
        >
          Dev mode · code is {devCode}
        </p>
      )}

      {errorBox}

      <Button
        variant="primary"
        size="lg"
        onClick={() => verify(code)}
        disabled={verifying || code.length !== 4}
      >
        {verifying ? "Verifying…" : "Verify & see my rank"}
      </Button>

      <div className="flex items-center justify-center gap-4 text-center">
        <button
          type="button"
          onClick={() => setStage("phone")}
          className="text-text-muted hover:text-text-title transition-colors"
          style={{ fontSize: "var(--body-sm-size)" }}
        >
          Change number
        </button>
        <span className="text-border-default">·</span>
        <button
          type="button"
          onClick={() => sendOtp(phone)}
          disabled={resendIn > 0 || sending}
          className="text-brand-accent hover:text-brand-hover transition-colors disabled:text-text-muted disabled:cursor-not-allowed"
          style={{ fontSize: "var(--body-sm-size)" }}
        >
          {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
        </button>
      </div>
    </div>
  );
}
