/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { ProductGrid, Title } from "@/components";
import { prisma } from "@/lib/prisma";
import { Gender } from "@/app/generated/prisma";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const labels: Record<string, string> = {
  men: "para hombres",
  women: "para mujeres",
  kid: "para niños",
  unisex: "para todos",
};

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;

  // 1. Validar y normalizar la categoría para Prisma
  const category = id === "kids" ? "kid" : id;

  // 2. Consultar productos directamente de la Base de Datos
  const products = await prisma.product.findMany({
    where: {
      gender: category as Gender,
    },
    include: {
      ProductImage: {
        take: 2,
        select: { url: true },
      },
    },
  });

  // 3. Validar si la categoría existe en nuestros labels
  if (!labels[category]) {
    notFound();
  }

  // 4. Mapear para que ProductGrid reciba lo que espera (opcional si ProductGrid ya maneja ProductImage)
  const mappedProducts = products.map((product) => ({
    ...product,
    images: product.ProductImage.map((img) => img.url),
  }));

  return (
    <>
      <Title
        title={`Artículos ${labels[category]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={mappedProducts as any} />
    </>
  );
}
