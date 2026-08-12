import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AmountMap } from "@/lib/wealth/calculate";

export interface QuestState {
  /** Neon lead id, or null when persistence is stubbed (no DATABASE_URL). */
  leadId: number | null;
  firstName: string;
  lastName: string;
  /** Full E.164-ish phone, e.g. +919876543210. */
  phone: string;
  /** Set once the phone is OTP-verified (mock for now). */
  phoneVerified: boolean;
  /** Furthest step index reached (0=Name … 3=Reveal). */
  highestLevel: number;
  /** Asset amounts keyed by field key (see lib/wealth/inputs.ts). */
  assets: AmountMap;

  setName: (data: { firstName: string; lastName: string }) => void;
  setLead: (data: {
    leadId: number | null;
    phone: string;
    phoneVerified: boolean;
  }) => void;
  reachLevel: (level: number) => void;
  setAsset: (key: string, value: number) => void;
  reset: () => void;
}

const initial = {
  leadId: null,
  firstName: "",
  lastName: "",
  phone: "",
  phoneVerified: false,
  highestLevel: 0,
  assets: {} as AmountMap,
};

export const useQuestStore = create<QuestState>()(
  persist(
    (set) => ({
      ...initial,
      setName: ({ firstName, lastName }) => set({ firstName, lastName }),
      setLead: ({ leadId, phone, phoneVerified }) =>
        set({ leadId, phone, phoneVerified }),
      reachLevel: (level) =>
        set((s) => ({ highestLevel: Math.max(s.highestLevel, level) })),
      setAsset: (key, value) =>
        set((s) => ({ assets: { ...s.assets, [key]: value } })),
      reset: () => set({ ...initial, assets: {} }),
    }),
    { name: "iwr-quest" },
  ),
);
