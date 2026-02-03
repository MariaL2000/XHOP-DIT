import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];

  // Hydration
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Computed
  getTotalItems: () => number;
  getSummaryInformation: () => {
    subTotal: number;
    tax: number;
    total: number;
    itemsInCart: number;
  };

  // Actions
  addProductTocart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
  clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      getTotalItems: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),

      getSummaryInformation: () => {
        const { cart } = get();
        const subTotal = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const itemsInCart = cart.reduce((sum, p) => sum + p.quantity, 0);
        return { subTotal, tax, total, itemsInCart };
      },

      addProductTocart: (product: CartProduct) => {
        const { cart } = get();
        const exists = cart.some(
          (p) => p.id === product.id && p.size === product.size,
        );
        if (!exists) return set({ cart: [...cart, product] });

        set({
          cart: cart.map((p) =>
            p.id === product.id && p.size === product.size
              ? { ...p, quantity: p.quantity + product.quantity }
              : p,
          ),
        });
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        set({
          cart: get().cart.map((p) =>
            p.id === product.id && p.size === product.size
              ? { ...p, quantity }
              : p,
          ),
        });
      },

      removeProduct: (product: CartProduct) => {
        set({
          cart: get().cart.filter(
            (p) => p.id !== product.id || p.size !== product.size,
          ),
        });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "shopping-cart",
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
    },
  ),
);
