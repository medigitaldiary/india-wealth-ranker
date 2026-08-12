/** Lightweight placeholder shown until the component has mounted on the client. */
export function FormSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse" aria-hidden>
      <div className="h-[76px] rounded-[var(--r-16)] bg-surface-sunken border border-border-subtle" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[68px] rounded-[var(--r-10)] bg-surface-sunken border border-border-subtle"
          />
        ))}
      </div>
    </div>
  );
}
