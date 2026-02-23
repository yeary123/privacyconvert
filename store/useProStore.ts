import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "privacyconvert_pro";

export type ConversionHistoryItem = {
  tool: string;
  count: number;
  at: number;
};

export const useProStore = create<{
  isPro: boolean;
  setPro: (value: boolean) => void;
  hydrate: () => void;
  history: ConversionHistoryItem[];
  addHistory: (tool: string, count: number) => void;
  batchCount: number;
  setBatchCount: (n: number) => void;
}>()(
  persist(
    (set) => ({
      isPro: false,
      setPro: (value) => set({ isPro: value }),
      hydrate: () => {
        if (typeof window === "undefined") return;
        const raw = window.localStorage.getItem(STORAGE_KEY);
        try {
          const data = raw ? JSON.parse(raw) : null;
          const isPro = data?.state?.isPro === true;
          set({ isPro });
        } catch {
          set({ isPro: !!raw });
        }
      },
      history: [],
      addHistory: (tool, count) =>
        set((s) => ({
          history: [
            { tool, count, at: Date.now() },
            ...s.history.slice(0, 49),
          ],
        })),
      batchCount: 0,
      setBatchCount: (n) => set({ batchCount: n }),
    }),
    { name: STORAGE_KEY }
  )
);
