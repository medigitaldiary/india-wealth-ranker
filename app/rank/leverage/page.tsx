import { LiabilitiesForm } from "@/components/quest/LiabilitiesForm";

export default function Level3Page() {
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
          <i className="ri-scales-3-line text-base" aria-hidden />
          Level 3 · The Leverage
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
          What you owe
        </h1>
        <p
          className="text-text-body"
          style={{
            fontSize: "var(--body-md-size)",
            lineHeight: "var(--body-md-line)",
          }}
        >
          Now subtract your debts. The ticker above becomes your real net worth.
        </p>
      </header>

      <LiabilitiesForm />
    </div>
  );
}
