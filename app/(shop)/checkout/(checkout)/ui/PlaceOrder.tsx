"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { placeOrder, PlaceOrderResponse, PlaceOrderSuccess } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";

export const PlaceOrder = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const addressHasHydrated = useAddressStore((state) => state.hasHydrated);

  const cart = useCartStore((state) => state.cart);
  const cartHasHydrated = useCartStore((state) => state.hasHydrated);
  const clearCart = useCartStore((state) => state.clearCart);

  // ✅ useMemo SIEMPRE antes de cualquier return
  const { itemsInCart, subTotal, tax, total } = useMemo(() => {
    if (!cart || cart.length === 0) {
      return {
        itemsInCart: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
      };
    }

    const subTotalCalc = cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    );

    const taxCalc = subTotalCalc * 0.15;
    const totalCalc = subTotalCalc + taxCalc;
    const itemsCalc = cart.reduce((acc, p) => acc + p.quantity, 0);

    return {
      itemsInCart: itemsCalc,
      subTotal: subTotalCalc,
      tax: taxCalc,
      total: totalCalc,
    };
  }, [cart]);

  // 🚨 Los returns SIEMPRE después de todos los hooks
  if (!cartHasHydrated || !addressHasHydrated) return null;

  if (!cart || cart.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-7">
        <p className="text-gray-500">No hay productos en el carrito</p>
      </div>
    );
  }

  const onPlaceOrder = async () => {
    if (isPlacingOrder) return;

    setIsPlacingOrder(true);
    setErrorMessage("");

    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    try {
      const resp: PlaceOrderResponse = await placeOrder(
        productsToOrder,
        address,
      );

      if (!resp.ok) {
        setErrorMessage(resp.message);
        setIsPlacingOrder(false);
        return;
      }

      const successResp = resp as PlaceOrderSuccess;

      clearCart();
      router.replace("/orders/" + successResp.order.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error?.message || "Ocurrió un error al colocar la orden");
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Resumen de orden</h2>

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
        <span className="mt-5 text-2xl text-right">
          {currencyFormat(total)}
        </span>
      </div>

      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

      <button
        onClick={onPlaceOrder}
        disabled={isPlacingOrder || itemsInCart === 0}
        className={clsx("btn-primary mt-5", {
          "btn-disabled": isPlacingOrder,
        })}
      >
        {isPlacingOrder ? "Procesando..." : "Colocar orden"}
      </button>
    </div>
  );
};
