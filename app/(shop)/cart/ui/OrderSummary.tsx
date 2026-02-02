"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const OrderSummary = () => {
  const router = useRouter();

  const itemsInCart = useCartStore((state) => state.cart.length);
  const subTotal = useCartStore((state) =>
    state.cart.reduce((acc, p) => acc + p.price * p.quantity, 0)
  );
  const tax = subTotal * 0.15;
  const total = subTotal + tax;

  useEffect(() => {
    if (itemsInCart === 0) {
      router.replace("/empty");
    }
  }, [itemsInCart, router]);

  if (itemsInCart === 0) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2">
      <span>No. Productos</span>
      <span className="text-right">
        {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
      </span>

      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>

      <span>Impuestos (15%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>

      <span className="mt-5 text-2xl">Total:</span>
      <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
    </div>
  );
};
