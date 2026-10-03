"use client";

import { useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { QuantitySelector, SizeSelector } from "@/components";
import type { CartProduct, Product } from "@/interfaces";
import { Size } from "@/app/generated/prisma";
import { useCartStore } from "@/store";
import clsx from "clsx";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductTocart);

  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false); // Estado opcional para avisar si falta elegir talla

  const hasSizes = product.sizes.length > 0;

  const addToCart = () => {
    setPosted(true);

    // Si el producto tiene tallas y el usuario NO ha seleccionado ninguna, detenemos la acción
    if (hasSizes && !size) {
      return;
    }

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
      // Si tiene tallas manda la seleccionada, si no tiene tallas puede ir undefined o una cadena vacía según tu interfaz
      size: hasSizes ? (size as Size) : (undefined as unknown as Size),
      image: product.images[0],
      inStock: product.inStock,
    };

    addProductToCart(cartProduct);

    // Reset estados
    setPosted(false);
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <div className="flex flex-col gap-6 my-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {hasSizes && (
        <div className="flex flex-col gap-2">
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
            <SizeSelector
              selectedSize={size}
              availableSizes={product.sizes}
              onSizeChanged={setSize}
            />
          </div>
          {/* Mensaje de aviso si intenta comprar sin elegir talla */}
          {posted && !size && (
            <span className="text-red-500 text-xs font-medium text-center animate-pulse">
              Por favor, selecciona una talla
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Seleccionar Cantidad
        </span>
        <QuantitySelector
          quantity={quantity}
          inStock={product.inStock}
          onQuantityChanged={setQuantity}
        />
      </div>

      <button
        onClick={addToCart}
        className={clsx(
          "relative group overflow-hidden w-full flex items-center justify-center gap-3 px-8 py-4 text-white font-bold uppercase tracking-widest text-xs rounded-2xl transition-all duration-300 active:scale-95 shadow-xl shadow-black/5",
          "hover:shadow-2xl hover:-translate-y-1",
        )}
        style={{ backgroundColor: "var(--brand-black)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--brand-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--brand-black)";
        }}
      >
        <IoCartOutline size={20} className="group-hover:animate-bounce" />
        <span className="relative z-10">Agregar al carrito</span>

        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </button>

      <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
        Envío gratuito en pedidos superiores a $3000
      </p>
    </div>
  );
};
