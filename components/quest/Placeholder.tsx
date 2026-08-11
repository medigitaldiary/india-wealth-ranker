/**
 * Shared crystal-card placeholder for quest levels not yet built.
 * Replaced with real level content in Phases 2–4.
 */
export function Placeholder({
  overline,
  title,
  body,
  icon,
}: {
  overline: string;
  title: string;
  body: string;
  icon: string; // remix icon class, e.g. "ri-user-line"
}) {
  return (
    <div
      className="rounded-[var(--r-16)] border border-border-subtle bg-surface-card p-6 sm:p-8 flex flex-col gap-4"
      style={{ boxShadow: "var(--shadow-xs)" }}
    >
      <span
        className="inline-flex items-center gap-2 text-brand-accent"
        style={{
          fontSize: "var(--overline-size)",
          letterSpacing: "var(--overline-tracking)",
          textTransform: "uppercase",
          fontWeight: "var(--weight-medium)",
        }}
      >
        <i className={`${icon} text-base`} aria-hidden />
        {overline}
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
        {title}
      </h1>
      <p
        className="text-text-body"
        style={{
          fontSize: "var(--body-md-size)",
          lineHeight: "var(--body-md-line)",
        }}
      >
        {body}
      </p>
    </div>
  );
}
