import { PhoneForm } from "@/components/quest/PhoneForm";

export default function VerifyPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span
          className="inline-flex items-center gap-2 text-brand-accent"
          style={{
            fontSize: "var(--overline-size)",
            letterSpacing: "var(--overline-tracking)",
            textTransform: "uppercase",
            fontWeight: "var(--weight-medium)",
          }}
        >
          <i className="ri-shield-check-line text-base" aria-hidden />
          Step 3 · Verify
        </span>
        <h1
          className="text-text-title"
          style={{
            fontSize: "var(--h2-size)",
            lineHeight: "var(--h2-line)",
            letterSpacing: "var(--h2-tracking)",
            fontWeight: "var(--weight-semibold)",
          }}
        >
          One last step
        </h1>
        <p
          className="text-text-body"
          style={{ fontSize: "var(--body-md-size)", lineHeight: "var(--body-md-line)" }}
        >
          Enter your number to unlock your All India Rank.
        </p>
      </header>

      <div
        className="rounded-[var(--r-16)] border border-border-subtle bg-surface-card p-6 sm:p-7"
        style={{ boxShadow: "var(--shadow-xs)" }}
      >
        <PhoneForm />
      </div>
    </div>
  );
}
