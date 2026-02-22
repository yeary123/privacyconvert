import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "privacyconvert_pro";

export const useProStore = create<{
  isPro: boolean;
  setPro: (value: boolean) => void;
  hydrate: () => void;
}>()(
  persist(
    (set) => ({
      isPro: false,
      setPro: (value) => set({ isPro: value }),
      hydrate: () => {
        if (typeof window === "undefined") return;
        const raw = window.localStorage.getItem(STORAGE_KEY);
        set({ isPro: !!raw });
      },
    }),
    { name: STORAGE_KEY }
  )
);
