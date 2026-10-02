"use client";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export const OrderSummary = () => {
  const router = useRouter();

  const cart = useCartStore((state) => state.cart);
  const itemsInCart = useCartStore((state) => state.cart.length);

  // ✅ Cálculo exacto del total sin impuestos (solo precio x cantidad)
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

  if (itemsInCart === 0) return <p>Loading...</p>;

  // 🟢 Función de WhatsApp leyendo el número desde las variables de entorno
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
    <div>
      {/* 🔹 Muestra únicamente el Total exacto sin impuestos */}
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
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
      >
        <span>📱 Pedir por WhatsApp</span>
      </button>

      {/* 
      // 💬 CÓDIGO ORIGINAL COMENTADO (Con impuestos y subtotales anteriores)
      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>
        ...
      </div>
      */}
    </div>
  );
};
