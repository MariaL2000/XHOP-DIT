"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components";

interface Props {
  products: any[];
}

export default function ProductTable({ products }: Props) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;

    try {
      setLoadingId(id);

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message ?? "No se pudo eliminar");
        return;
      }

      // 🔥 recarga total como pediste
      window.location.reload();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <tbody>
      {products.map((product) => (
        <tr
          key={product.id}
          className="bg-white border-b hover:bg-gray-50 transition duration-300"
        >
          {/* Imagen */}
          <td className="px-4 py-3 whitespace-nowrap">
            <Link href={`/product/${product.slug}`}>
              <ProductImage
                src={product.images?.[0]}
                width={80}
                height={80}
                alt={product.title}
                className="w-20 h-20 object-cover rounded shadow-sm hover:scale-105 transition-transform"
              />
            </Link>
          </td>

          {/* Título */}
          <td className="text-gray-900 px-4 py-3">
            <Link
              href={`/admin/product/${product.slug}`}
              className="hover:underline"
            >
              {product.title}
            </Link>
          </td>

          {/* Precio */}
          <td className="text-gray-900 font-bold px-4 py-3">{product.price}</td>

          {/* Género */}
          <td className="text-gray-900 px-4 py-3">{product.gender}</td>

          {/* Inventario */}
          <td className="text-gray-900 font-bold px-4 py-3">
            {product.inStock}
          </td>

          {/* Tallas */}
          <td className="text-gray-900 font-bold px-4 py-3">
            {product.sizes?.join(", ")}
          </td>

          {/* Acción */}
          <td className="px-4 py-3">
            <button
              onClick={() => handleDelete(product.id)}
              disabled={loadingId === product.id}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition disabled:opacity-50"
            >
              {loadingId === product.id ? "Eliminando..." : "Eliminar"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
