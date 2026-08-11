import { AssetsForm } from "@/components/quest/AssetsForm";

export default function Level2Page() {
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
          <i className="ri-wallet-3-line text-base" aria-hidden />
          Level 2 · The Portfolio
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
          What you own
        </h1>
        <p
          className="text-text-body"
          style={{
            fontSize: "var(--body-md-size)",
            lineHeight: "var(--body-md-line)",
          }}
        >
          Add up your assets and watch the total climb. None of it is shared
          publicly.
        </p>
      </header>

      <AssetsForm />
    </div>
  );
}
