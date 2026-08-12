import { NameForm } from "@/components/quest/NameForm";

export default function NamePage() {
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
          Step 1 · You
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
          What&apos;s your name?
        </h1>
        <p
          className="text-text-body"
          style={{ fontSize: "var(--body-md-size)", lineHeight: "var(--body-md-line)" }}
        >
          We&apos;ll use it to personalise your All India Rank.
        </p>
      </header>

      <div
        className="rounded-[var(--r-16)] border border-border-subtle bg-surface-card p-6 sm:p-7"
        style={{ boxShadow: "var(--shadow-xs)" }}
      >
        <NameForm />
      </div>
    </div>
  );
}
