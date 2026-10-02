"use client";

import { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import clsx from "clsx";

// import { placeOrder, PlaceOrderResponse, PlaceOrderSuccess } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils";

export default function PlaceOrder() {
  // const router = useRouter();

  // const [errorMessage, setErrorMessage] = useState("");
  // const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const address = useAddressStore((state) => state.address);
  const addressHasHydrated = useAddressStore((state) => state.hasHydrated);

  const cart = useCartStore((state) => state.cart);
  const cartHasHydrated = useCartStore((state) => state.hasHydrated);
  // const clearCart = useCartStore((state) => state.clearCart);

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

  /* 
  // 📝 CÓDIGO ORIGINAL COMENTADO
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
    } catch (error: any) {
      setErrorMessage(error?.message || "Ocurrió un error al colocar la orden");
      setIsPlacingOrder(false);
    }
  };
  */

  // 🟢 NUEVA FUNCIÓN: Generar enlace de WhatsApp con el detalle
  const handleWhatsAppCheckout = () => {
    const phoneNumber = "+5351834749"; // ⚠️ Reemplaza con tu número de WhatsApp

    // Crear un texto con los productos y el total
    const productsList = cart
      .map(
        (p) =>
          `- ${p.title} (${p.size}) x${p.quantity}: ${currencyFormat(p.price * p.quantity)}`,
      )
      .join("\n");

    const message = `¡Hola! Me gustaría realizar el siguiente pedido:\n\n${productsList}\n\n*Total a pagar: ${currencyFormat(total)}*\n\nDirección de entrega:\n${address.firstName} ${address.lastName}\n${address.address}, ${address.city}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-4 font-bold">Resumen de orden</h2>

      {/* 🔹 Vista simplificada: Solo muestra el Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl font-semibold">Total a Pagar:</span>
        <span className="text-2xl font-bold text-green-600">
          {currencyFormat(total)}
        </span>
      </div>

      {/* Botón de Contacto por WhatsApp */}
      <button
        onClick={handleWhatsAppCheckout}
        disabled={itemsInCart === 0}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
      >
        <span>📱 Contactar por WhatsApp</span>
      </button>

      {/* 
      // 💬 BLOQUE ORIGINAL COMENTADO (HTML)
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
      */}
    </div>
  );
}
