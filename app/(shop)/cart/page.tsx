"use client";

import Link from "next/link";
import { useCartStore } from "@/store";
import { Title } from "@/components";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";

export default function CartPage() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  // Evitamos renderizar diferencias entre servidor y cliente hasta que Zustand esté listo
  if (!hasHydrated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-400 animate-pulse font-medium">
          Cargando carrito...
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen mb-20 px-3 sm:px-10">
      <div className="flex flex-col w-full max-w-5xl">
        <Title title="Carrito de Compras" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {/* Carrito */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-700">
                Tus productos
              </span>
              <Link
                href="/"
                className="text-sm underline text-blue-600 hover:text-blue-800"
              >
                Continúa comprando
              </Link>
            </div>

            <ProductsInCart />
          </div>

          {/* Resumen de orden */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-7 h-fit w-full">
            <h2 className="text-xl sm:text-2xl mb-4 font-bold text-gray-900">
              Resumen de orden
            </h2>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
