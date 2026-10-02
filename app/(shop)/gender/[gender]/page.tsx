import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";

// 🟢 1. Añadidas todas las nuevas opciones para evitar errores de tipo o undefined
const labels: Record<string, string> = {
  men: "para hombres",
  women: "para mujeres",
  kid: "para niños",
  unisex: "para todos",
  books: "de libros",
  food: "de comida",
  technologies: "de tecnología",
};

interface Props {
  params: Promise<{ gender: string }>;
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

export default async function GenderPage({ params, searchParams }: Props) {
  const { gender: genderParam } = await params;
  const { page, category: categoryId } = await searchParams;

  const gender = genderParam as Gender;
  const currentPage = page ? Number(page) : 1;

  const [{ products, totalPages }] = await Promise.all([
    getPaginatedProductsWithImages({
      page: currentPage,
      gender,
      categoryId: categoryId,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="container mx-auto px-3 sm:px-5 mb-16">
      <Title
        title={`Artículos ${labels[gender] || "Generales"}`}
        className="mb-4"
      />

      {/* 🟢 2. Se removió el ProductTypeNavbar redundante */}

      {products.length === 0 ? (
        <div className="text-center mt-12 text-gray-500">
          No hay productos disponibles en esta sección.
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      <Pagination totalPages={totalPages} />
    </div>
  );
}
