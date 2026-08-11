import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TierId } from "@/lib/wealth/benchmarks";
import type { AmountMap } from "@/lib/wealth/calculate";

export interface QuestState {
  /** Neon lead id, or null when persistence is stubbed (no DATABASE_URL). */
  leadId: number | null;
  fullName: string;
  /** Full E.164-ish phone, e.g. +919876543210. */
  phone: string;
  /** Optional city — powers the anonymized "User from <city>" handle. */
  city: string;
  /** Highest tier unlocked so far. */
  tier: TierId | null;
  /** Furthest level index reached (0=Level1 … 3=Reveal). */
  highestLevel: number;

  /** Asset amounts keyed by field key (see lib/wealth/inputs.ts). */
  assets: AmountMap;
  /** Liability amounts keyed by field key. */
  liabilities: AmountMap;

  setLead: (data: {
    leadId: number | null;
    fullName: string;
    phone: string;
    city: string;
  }) => void;
  unlockTier: (tier: TierId) => void;
  reachLevel: (level: number) => void;
  setAmount: (kind: "assets" | "liabilities", key: string, value: number) => void;
  reset: () => void;
}

const initial = {
  leadId: null,
  fullName: "",
  phone: "",
  city: "",
  tier: null as TierId | null,
  highestLevel: 0,
  assets: {} as AmountMap,
  liabilities: {} as AmountMap,
};

export const useQuestStore = create<QuestState>()(
  persist(
    (set) => ({
      ...initial,
      setLead: ({ leadId, fullName, phone, city }) =>
        set({ leadId, fullName, phone, city }),
      unlockTier: (tier) => set({ tier }),
      reachLevel: (level) =>
        set((s) => ({ highestLevel: Math.max(s.highestLevel, level) })),
      setAmount: (kind, key, value) =>
        set((s) => ({
          [kind]: { ...s[kind], [key]: value },
        })),
      reset: () => set({ ...initial, assets: {}, liabilities: {} }),
    }),
    { name: "iwr-quest" },
  ),
);
