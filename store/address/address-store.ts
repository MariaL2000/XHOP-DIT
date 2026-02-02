import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
}

interface State {
  address: Address;

  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  setAddress: (address: Address) => void;
  clearAddress: () => void;
}

export const useAddressStore = create<State>()(
  persist(
    (set) => ({
      address: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
      },

      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),

      setAddress: (address) => set({ address }),
      clearAddress: () =>
        set({
          address: {
            firstName: "",
            lastName: "",
            address: "",
            address2: "",
            postalCode: "",
            city: "",
            country: "",
            phone: "",
          },
        }),
    }),
    {
      name: "address-storage",
      onRehydrateStorage: () => (state) => {
        console.log("💧 Address store rehidratada");
        if (state) state.setHasHydrated(true);
      },
    },
  ),
);
