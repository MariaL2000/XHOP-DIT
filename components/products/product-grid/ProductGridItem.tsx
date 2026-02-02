"use client";

import { useState } from "react";
import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { ProductImage } from "@/components/product/product-image/ProductImage";
import { Product } from "@/interfaces";

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);

  const cartButtonStyle = {
    backgroundColor: "var(--brand-black, #111827)", // Color inicial (Negro)
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  } as React.CSSProperties;

  return (
    <div className="group relative flex flex-col bg-white/50 backdrop-blur-md border border-white/30 rounded-[1.8rem] transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-2">
      {/* Contenedor de Imagen */}
      <div className="relative overflow-hidden rounded-3xl m-2">
        <Link href={`/product/${product.slug}`}>
          <ProductImage
            src={displayImage}
            alt={product.title}
            width={600} // Aumentado para mejor resolución en Mac/Desktop
            height={600}
            className="w-full h-full aspect-4/5 object-cover transition-transform duration-1000 group-hover:scale-110"
            onMouseEnter={() =>
              setDisplayImage(product.images[1] || product.images[0])
            }
            onMouseLeave={() => setDisplayImage(product.images[0])}
          />
        </Link>
      </div>

      {/* Info del Producto */}
      <div className="flex flex-col p-6 pt-2">
        <Link
          className="text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1 mb-1"
          href={`/product/${product.slug}`}
        >
          {product.title}
        </Link>

        <div className="flex justify-between items-center mt-2">
          <span className="text-xl font-black text-gray-900 tracking-tight">
            ${product.price}
          </span>

          <Link
            href={`/product/${product.slug}`}
            style={cartButtonStyle}
            className="flex items-center justify-center text-white p-2.5 rounded-xl shadow-lg shadow-gray-200 group sm:scale-100 scale-90"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--brand-primary)";
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(37, 99, 235, 0.3)"; // Sombra azul en hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--brand-black, #111827)";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
            }}
          >
            <IoCartOutline
              size={20}
              className="transition-transform duration-300 group-hover:-rotate-12"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
