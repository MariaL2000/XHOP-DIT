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

  const hasSizes = product.sizes.length > 0;

  const addToCart = () => {
    const finalSize: Size = hasSizes ? (size ?? product.sizes[0]) : Size.XS;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
      size: finalSize,
      image: product.images[0],
    };

    addProductToCart(cartProduct);

    // Reset estados
    setQuantity(1);
    setSize(undefined);
  };

  return (
    <div className="flex flex-col gap-6 my-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {hasSizes && (
        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          <SizeSelector
            selectedSize={size}
            availableSizes={product.sizes}
            onSizeChanged={setSize}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Seleccionar Cantidad
        </span>
        <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />
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
