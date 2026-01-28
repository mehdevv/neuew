import { LoginResponse } from "@/lib/service/store-auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: LoginResponse["user"] | null;
  token: string | null;
  _hasHydrated: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
  isStoreUser: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      _hasHydrated: false,
      login: (data) => set({ user: data.user, token: data.token }),
      logout: () => set({ user: null, token: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      isStoreUser: () => {
        const user = get().user;
        // Store users have storeuser_id > 0, travelers have storeuser_id === 0
        return user !== null && user.storeuser_id > 0;
      },
    }),
    { 
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
