import { AssetsForm } from "@/components/quest/AssetsForm";

export default function AssetsPage() {
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
          Add your assets
        </h1>
        <p
          className="text-text-body"
          style={{ fontSize: "var(--body-md-size)", lineHeight: "var(--body-md-line)" }}
        >
          None of it is shared publicly.
        </p>
      </header>

      <AssetsForm />
    </div>
  );
}
