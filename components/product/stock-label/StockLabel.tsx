"use client";

import { getStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";
import { useEffect, useEffectEvent, useState } from "react";

interface Props {
  slug: string;
}

export const StockLabel = ({ slug }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stock, setStock] = useState<number>(0);

  const getStock = async () => {
    const inStock = await getStockBySlug(slug);
    setStock(inStock);
    setIsLoading(false);
  };

  const effectStock = useEffectEvent(getStock);

  useEffect(() => {
    effectStock();
  }, []);

  if (isLoading) {
    return (
      <h1
        className={`${titleFont.className} animate-pulse bg-gray-200 text-lg font-bold antialiased`}
      >
        &nbsp;
      </h1>
    );
  }

  return (
    <h1
      className={`${titleFont.className} text-lg font-bold antialiased ${
        stock === 0 ? "text-red-600" : ""
      }`}
    >
      {stock === 0 ? "Sin stock disponible" : `Stock: ${stock}`}
    </h1>
  );
};
