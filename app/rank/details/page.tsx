import { DetailsForm } from "@/components/quest/DetailsForm";

export default function DetailsPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1
          className="text-text-title"
          style={{
            fontSize: "var(--h2-size)",
            lineHeight: "var(--h2-line)",
            letterSpacing: "var(--h2-tracking)",
            fontWeight: "var(--weight-semibold)",
          }}
        >
          Almost there
        </h1>
        <p
          className="text-text-body"
          style={{ fontSize: "var(--body-md-size)", lineHeight: "var(--body-md-line)" }}
        >
          Add your details and verify your number to unlock your All-India Rank.
        </p>
      </header>

      <div
        className="rounded-[var(--r-16)] border border-border-subtle bg-surface-card p-6 sm:p-7"
        style={{ boxShadow: "var(--shadow-xs)" }}
      >
        <DetailsForm />
      </div>
    </div>
  );
}
