"use client";

import Link from "next/link";
import { useCartStore } from "@/store";
import { QuantitySelector } from "@/components";
import { ProductImage } from "@/components";

export const ProductsInCart = () => {
  const cart = useCartStore((state) => state.cart);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity,
  );
  const removeProduct = useCartStore((state) => state.removeProduct);

  if (!hasHydrated) return null;

  if (!cart || cart.length === 0) {
    return <p className="text-gray-500">Tu carrito está vacío</p>;
  }

  return (
    <>
      {cart.map((product) => (
        <div
          key={`${product.slug}-${product.size}`}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-200 last:border-b-0"
        >
          {/* Contenedor estricto para la imagen para que no se deforme */}
          <div className="w-[100px] h-[100px] relative flex-shrink-0 self-center sm:self-start overflow-hidden rounded">
            <ProductImage
              src={product.image}
              width={100}
              height={100}
              alt={product.title}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Contenedor de la información del producto */}
          <div className="flex flex-col flex-grow w-full sm:w-auto">
            <Link
              className="hover:underline cursor-pointer font-medium text-sm sm:text-base line-clamp-2"
              href={`/product/${product.slug}`}
            >
              {product.size} - {product.title}
            </Link>

            <p className="font-bold mt-1 text-gray-800">${product.price}</p>

            <div className="mt-2">
              <QuantitySelector
                quantity={product.quantity}
                onQuantityChanged={(quantity) =>
                  updateProductQuantity(product, quantity)
                }
              />
            </div>

            <button
              onClick={() => removeProduct(product)}
              className="underline text-red-500 hover:text-red-700 text-sm mt-3 self-start cursor-pointer"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </>
  );
};
