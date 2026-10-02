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

// 🟢 Etiquetas actualizadas con las nuevas categorías de la tienda general y sin 'kid'
const labels: Record<string, string> = {
  men: "para hombres",
  women: "para mujeres",
  unisex: "para todos",
  books: "de libros",
  food: "de comida",
  technologies: "de tecnología",
};

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;

  // 1. Validar primero si la categoría/género existe en nuestros labels
  if (!labels[id]) {
    notFound();
  }

  // 2. Consultar productos directamente de la Base de Datos usando el ID de la URL
  const products = await prisma.product.findMany({
    where: {
      gender: id as Gender,
    },
    include: {
      ProductImage: {
        take: 2,
        select: { url: true },
      },
    },
  });

  // 3. Mapear para que ProductGrid reciba las imágenes correctamente
  const mappedProducts = products.map((product) => ({
    ...product,
    images: product.ProductImage.map((img) => img.url),
  }));

  return (
    <>
      <Title
        title={`Artículos ${labels[id]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={mappedProducts as any} />
    </>
  );
}
