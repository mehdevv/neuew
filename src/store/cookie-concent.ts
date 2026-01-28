import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConsentState {
  consentGiven: boolean;
  setConsent: (value: boolean) => void;
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      consentGiven: false,
      setConsent: (value) => set({ consentGiven: value }),
    }),
    {
      name: "cookie-consent",
      onRehydrateStorage: () => (state) => {
        if (state?.consentGiven) {
          // console.log("User had already given consent");
        }
      },
    },
  ),
);
