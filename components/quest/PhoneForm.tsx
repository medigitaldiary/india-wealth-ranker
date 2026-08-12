"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/bondscanner/forms/Input";
import { Button } from "@/components/bondscanner/core/Button";
import { phoneSchema, type PhoneInput } from "@/lib/validation/schemas";
import { useQuestStore } from "@/lib/store/questStore";
import { useHydrated } from "@/lib/hooks/useHydrated";

/**
 * Phone step. Captures the lead (deduped on phone) and gates the reveal.
 * OTP verification is mocked for now — the real Smartping/DLT flow is a
 * separate workstream and slots in here.
 */
export function PhoneForm() {
  const router = useRouter();
  const hydrated = useHydrated();
  const firstName = useQuestStore((s) => s.firstName);
  const lastName = useQuestStore((s) => s.lastName);
  const highestLevel = useQuestStore((s) => s.highestLevel);
  const setLead = useQuestStore((s) => s.setLead);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  const [phase, setPhase] = useState<"idle" | "saving">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  // Funnel guard: must have name + assets first.
  useEffect(() => {
    if (hydrated && (!firstName || highestLevel < 2)) router.replace("/rank");
  }, [hydrated, firstName, highestLevel, router]);

  const { control, handleSubmit } = useForm<PhoneInput>({
    resolver: zodResolver(phoneSchema),
    mode: "onTouched",
    defaultValues: { phone: "" },
  });

  if (!hydrated) return null;

  const busy = phase !== "idle";

  const onSubmit = async (data: PhoneInput) => {
    setServerError(null);
    setPhase("saving");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone: data.phone }),
      });
      if (!res.ok) {
        setServerError("Something went wrong saving your details. Please try again.");
        setPhase("idle");
        return;
      }
      const json = (await res.json()) as { id: number | null };
      // Mock verification for now (real OTP flow slots in here).
      setLead({
        leadId: json.id ?? null,
        phone: `+91${data.phone}`,
        phoneVerified: true,
      });
      reachLevel(3);
      router.push("/rank/reveal");
    } catch {
      setServerError("Network error. Check your connection and try again.");
      setPhase("idle");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
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
            onChange={(e) =>
              field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            onBlur={field.onBlur}
            name={field.name}
            error={!!fieldState.error}
            hint={fieldState.error?.message ?? "We'll verify this with an OTP."}
          />
        )}
      />

      {serverError && (
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
          <span>{serverError}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={busy}
        trailingIcon={!busy && <i className="ri-arrow-right-line text-lg" aria-hidden />}
      >
        {busy ? "Saving…" : "See my rank"}
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
