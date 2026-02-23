"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export type AuthUser = User | null;

export const useAuthStore = create<{
  user: AuthUser;
  isPro: boolean;
  loading: boolean;
  demoProOverride: boolean;
  setDemoProOverride: (v: boolean) => void;
  fetchUser: () => Promise<void>;
  signOut: () => Promise<void>;
}>((set, get) => ({
  user: null,
  isPro: false,
  loading: true,
  demoProOverride: false,
  setDemoProOverride: (v) => set({ demoProOverride: v }),

  fetchUser: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user ?? null;
      if (!user?.id) {
        set({ user: null, isPro: false, loading: false });
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", user.id)
        .single();
      const isPro = !!profile?.is_pro || get().demoProOverride;
      set({ user, isPro, loading: false });
      // Keep useProStore.p2pEnabled in sync for transfer page
      const { useProStore } = await import("@/store/useProStore");
      useProStore.setState({ p2pEnabled: isPro });
    } catch {
      set({ user: null, isPro: false, loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, isPro: false });
    const { useProStore } = await import("@/store/useProStore");
    useProStore.setState({ p2pEnabled: false });
  },
}));
