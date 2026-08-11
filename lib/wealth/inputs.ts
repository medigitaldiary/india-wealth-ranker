/**
 * Wealth input schema — the single source of truth for every asset & liability
 * field (PRD §3.2). Both the Level 2 and Level 3 forms render from these, so
 * fields, keys, and totals never drift apart.
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
    id: "liquid",
    title: "Liquid assets",
    icon: "ri-bank-line",
    fields: [
      { key: "savings", label: "Savings accounts", icon: "ri-bank-line" },
      { key: "fd", label: "Fixed deposits", icon: "ri-safe-2-line" },
      { key: "stocks", label: "Stocks", icon: "ri-stock-line" },
      { key: "mutualFunds", label: "Mutual funds", icon: "ri-pie-chart-2-line" },
      { key: "bonds", label: "Bonds", icon: "ri-file-list-3-line" },
    ],
  },
  {
    id: "hard",
    title: "Hard assets",
    icon: "ri-home-4-line",
    fields: [
      {
        key: "realEstate",
        label: "Real estate",
        hint: "Current market value",
        icon: "ri-building-line",
      },
      { key: "gold", label: "Gold & jewellery", icon: "ri-vip-diamond-line" },
      { key: "vehicles", label: "Vehicles", icon: "ri-car-line" },
    ],
  },
  {
    id: "retirement",
    title: "Retirement",
    icon: "ri-shield-check-line",
    fields: [
      { key: "epf", label: "EPF balance", icon: "ri-briefcase-4-line" },
      { key: "ppf", label: "PPF balance", icon: "ri-seedling-line" },
      { key: "nps", label: "NPS balance", icon: "ri-government-line" },
    ],
  },
];

export const LIABILITY_GROUPS: GroupDef[] = [
  {
    id: "liabilities",
    title: "Liabilities",
    icon: "ri-scales-3-line",
    fields: [
      { key: "homeLoan", label: "Home loan", icon: "ri-home-4-line" },
      { key: "personalLoan", label: "Personal loan", icon: "ri-user-line" },
      { key: "carLoan", label: "Car loan", icon: "ri-car-line" },
      { key: "creditCard", label: "Credit card debt", icon: "ri-bank-card-line" },
    ],
  },
];

export const ASSET_KEYS = ASSET_GROUPS.flatMap((g) => g.fields.map((f) => f.key));
export const LIABILITY_KEYS = LIABILITY_GROUPS.flatMap((g) =>
  g.fields.map((f) => f.key),
);
