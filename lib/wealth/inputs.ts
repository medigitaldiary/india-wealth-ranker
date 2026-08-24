/**
 * Asset input schema — the single source of truth for the wealth entry fields.
 * Simplified to four inputs (no liabilities in this flow).
 */
export interface FieldDef {
  key: string;
  label: string;
  hint?: string;
  icon: string; // remix icon class
}

export interface GroupDef {
  id: string;
  title: string;
  icon: string;
  fields: FieldDef[];
}

export const ASSET_GROUPS: GroupDef[] = [
  {
    id: "assets",
    title: "Your assets",
    icon: "ri-wallet-3-line",
    fields: [
      { key: "fdCash", label: "FD / Cash", icon: "ri-safe-2-line" },
      { key: "bonds", label: "Bonds", icon: "ri-file-list-3-line" },
      {
        key: "equityMf",
        label: "Equity / Mutual funds",
        icon: "ri-line-chart-line",
      },
      {
        key: "others",
        label: "Others",
        hint: "Anything else you hold",
        icon: "ri-more-2-line",
      },
    ],
  },
];

export const ASSET_KEYS = ASSET_GROUPS.flatMap((g) => g.fields.map((f) => f.key));
