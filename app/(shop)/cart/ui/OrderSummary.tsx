"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export const OrderSummary = () => {
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);
  const itemsInCart = useCartStore((state) => state.cart.length);

  const { total } = useMemo(() => {
    if (!cart || cart.length === 0) {
      return { total: 0 };
    }
    const totalCalc = cart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    );
    return { total: totalCalc };
  }, [cart]);

  useEffect(() => {
    if (itemsInCart === 0) {
      router.replace("/empty");
    }
  }, [itemsInCart, router]);

  if (itemsInCart === 0) return <p>Cargando...</p>;

  const handleWhatsAppCheckout = () => {
    const phoneNumber = process.env.WHATSAPP_NUMBER;

    const productsList = cart
      .map(
        (p) =>
          `- ${p.title} (${p.size || "Única"}) x${p.quantity}: ${currencyFormat(p.price * p.quantity)}`,
      )
      .join("\n");

    const message = `¡Hola! Me gustaría realizar el siguiente pedido:\n\n${productsList}\n\n*Total a pagar: ${currencyFormat(total)}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Total a Pagar */}
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-lg font-medium text-gray-600">
          Total a Pagar:
        </span>
        <span className="text-xl sm:text-2xl font-bold text-green-600">
          {currencyFormat(total)}
        </span>
      </div>

      {/* Botón de WhatsApp adaptable a móviles */}
      <button
        onClick={handleWhatsAppCheckout}
        disabled={itemsInCart === 0}
        className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm sm:text-base mt-2"
      >
        <span>📱 Pedir por WhatsApp</span>
      </button>
    </div>
  );
};
