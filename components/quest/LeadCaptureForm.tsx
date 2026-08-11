"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/bondscanner/forms/Input";
import { Button } from "@/components/bondscanner/core/Button";
import { MilestoneToast } from "@/components/quest/MilestoneToast";
import { leadSchema, type LeadInput } from "@/lib/validation/schemas";
import { useQuestStore } from "@/lib/store/questStore";
import { TIER_BY_ID } from "@/lib/wealth/benchmarks";

export function LeadCaptureForm() {
  const router = useRouter();
  const setLead = useQuestStore((s) => s.setLead);
  const unlockTier = useQuestStore((s) => s.unlockTier);
  const reachLevel = useQuestStore((s) => s.reachLevel);

  const [phase, setPhase] = useState<"idle" | "saving" | "done">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched", // errors surface after first blur, then live-update
    defaultValues: { fullName: "", phone: "", city: "" },
  });

  const busy = phase !== "idle";

  const onSubmit = async (data: LeadInput) => {
    setServerError(null);
    setPhase("saving");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        setServerError("Something went wrong saving your details. Please try again.");
        setPhase("idle");
        return;
      }
      const json = (await res.json()) as { id: number | null };

      setLead({
        leadId: json.id ?? null,
        fullName: data.fullName.trim(),
        phone: `+91${data.phone}`,
        city: data.city?.trim() ?? "",
      });
      unlockTier("rising-aspirant");
      reachLevel(1);

      setPhase("done"); // triggers milestone
      setTimeout(() => router.push("/rank/portfolio"), 1700);
    } catch {
      setServerError("Network error. Check your connection and try again.");
      setPhase("idle");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        <Controller
          control={control}
          name="fullName"
          render={({ field, fieldState }) => (
            <Input
              label="Full name"
              required
              size="lg"
              placeholder="e.g. Aarav Sharma"
              leadingIcon={<i className="ri-user-line" aria-hidden />}
              autoComplete="name"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={!!fieldState.error}
              hint={fieldState.error?.message}
            />
          )}
        />

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
              hint={
                fieldState.error?.message ??
                "We'll only use this to send your rank."
              }
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field, fieldState }) => (
            <Input
              label="City"
              size="lg"
              placeholder="e.g. Mumbai"
              leadingIcon={<i className="ri-map-pin-line" aria-hidden />}
              autoComplete="address-level2"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={!!fieldState.error}
              hint={
                fieldState.error?.message ??
                "Optional. Shows up as “User from your city” on the leaderboard."
              }
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

        {/* CTA is disabled only while submitting — never permanently. Invalid
            input surfaces inline errors on click, it does not lock the button. */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={busy}
          trailingIcon={!busy && <i className="ri-arrow-right-line text-lg" aria-hidden />}
        >
          {phase === "saving"
            ? "Saving…"
            : phase === "done"
              ? "Unlocked!"
              : "Continue to assets"}
        </Button>

        <p
          className="text-center text-text-muted"
          style={{ fontSize: "var(--body-xs-size)", lineHeight: "var(--body-xs-line)" }}
        >
          <i className="ri-lock-2-line" aria-hidden /> Private · your numbers never
          appear on the public leaderboard.
        </p>
      </form>

      <MilestoneToast
        tier={TIER_BY_ID["rising-aspirant"]}
        show={phase === "done"}
        levelLabel="Level 1 complete"
      />
    </>
  );
}
