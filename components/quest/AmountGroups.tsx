"use client";

import { CurrencyField } from "./CurrencyField";
import type { GroupDef } from "@/lib/wealth/inputs";
import { useQuestStore } from "@/lib/store/questStore";

/**
 * Renders grouped currency inputs bound to the quest store. Used by both the
 * assets (Level 2) and liabilities (Level 3) forms so they stay consistent.
 */
export function AmountGroups({
  groups,
  kind,
}: {
  groups: GroupDef[];
  kind: "assets" | "liabilities";
}) {
  const values = useQuestStore((s) => s[kind]);
  const setAmount = useQuestStore((s) => s.setAmount);

  return (
    <>
      {groups.map((g) => (
        <section key={g.id} className="flex flex-col gap-4">
          <h2
            className="inline-flex items-center gap-2 text-text-title"
            style={{
              fontSize: "var(--h5-size)",
              lineHeight: "var(--h5-line)",
              fontWeight: "var(--weight-semibold)",
            }}
          >
            <i className={`${g.icon} text-brand-accent`} aria-hidden />
            {g.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {g.fields.map((f) => (
              <CurrencyField
                key={f.key}
                label={f.label}
                hint={f.hint}
                icon={f.icon}
                value={values[f.key] ?? 0}
                onChange={(n) => setAmount(kind, f.key, n)}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
