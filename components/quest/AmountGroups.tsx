"use client";

import { CurrencyField } from "./CurrencyField";
import { ASSET_GROUPS } from "@/lib/wealth/inputs";
import { useQuestStore } from "@/lib/store/questStore";

/** Renders the asset inputs bound to the quest store. */
export function AmountGroups() {
  const values = useQuestStore((s) => s.assets);
  const setAsset = useQuestStore((s) => s.setAsset);

  return (
    <>
      {ASSET_GROUPS.map((g) => (
        <div key={g.id} className="grid gap-4 sm:grid-cols-2">
          {g.fields.map((f) => (
            <CurrencyField
              key={f.key}
              label={f.label}
              hint={f.hint}
              icon={f.icon}
              value={values[f.key] ?? 0}
              onChange={(n) => setAsset(f.key, n)}
            />
          ))}
        </div>
      ))}
    </>
  );
}
