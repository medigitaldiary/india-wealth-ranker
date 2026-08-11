import { LeadCaptureForm } from "@/components/quest/LeadCaptureForm";

export default function Level1Page() {
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
          <i className="ri-user-line text-base" aria-hidden />
          Level 1 · The Foundation
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
          Let&apos;s start with you
        </h1>
        <p
          className="text-text-body"
          style={{
            fontSize: "var(--body-md-size)",
            lineHeight: "var(--body-md-line)",
          }}
        >
          Two quick details and you&apos;re on the board as a{" "}
          <strong className="text-text-title">Rising Aspirant</strong>. Then we
          tally up everything you own.
        </p>
      </header>

      <div
        className="rounded-[var(--r-16)] border border-border-subtle bg-surface-card p-6 sm:p-7"
        style={{ boxShadow: "var(--shadow-xs)" }}
      >
        <LeadCaptureForm />
      </div>
    </div>
  );
}
