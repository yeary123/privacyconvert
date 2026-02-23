import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "privacyconvert_pro";
const PROTECTED_COUNT_KEY = "privacyconvert_protected_count";
const DEFAULT_PROTECTED_COUNT = 128456;

export type ConversionHistoryItem = {
  tool: string;
  count: number;
  at: number;
};

export type BatchFileInfo = { name: string; size: number };

export const useProStore = create<{
  isPro: boolean;
  setPro: (value: boolean) => void;
  hydrate: () => void;
  history: ConversionHistoryItem[];
  addHistory: (tool: string, count: number) => void;
  batchCount: number;
  setBatchCount: (n: number) => void;
  batchFiles: BatchFileInfo[];
  setBatchFiles: (files: BatchFileInfo[]) => void;
  p2pEnabled: boolean;
  protectedCount: number;
  incrementProtected: (n: number) => void;
}>()(
  persist(
    (set, get) => ({
      isPro: false,
      setPro: (value) => set({ isPro: value, p2pEnabled: value }),
      hydrate: () => {
        if (typeof window === "undefined") return;
        const raw = window.localStorage.getItem(STORAGE_KEY);
        try {
          const data = raw ? JSON.parse(raw) : null;
          const isPro = data?.state?.isPro === true;
          let protectedCount = get().protectedCount;
          try {
            const pc = window.localStorage.getItem(PROTECTED_COUNT_KEY);
            if (pc) protectedCount = Math.max(DEFAULT_PROTECTED_COUNT, parseInt(pc, 10) || protectedCount);
          } catch {
            // ignore
          }
          set({ isPro, protectedCount, p2pEnabled: isPro });
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
      batchFiles: [],
      setBatchFiles: (files) => set({ batchFiles: files }),
      p2pEnabled: false,
      protectedCount: DEFAULT_PROTECTED_COUNT,
      incrementProtected: (n) =>
        set((s) => {
          const next = s.protectedCount + n;
          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem(PROTECTED_COUNT_KEY, String(next));
            } catch {
              // ignore
            }
          }
          return { protectedCount: next };
        }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        isPro: s.isPro,
        history: s.history,
        batchCount: s.batchCount,
        p2pEnabled: s.p2pEnabled,
      }),
    }
  )
);
