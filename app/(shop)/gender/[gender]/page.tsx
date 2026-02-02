import { getPaginatedProductsWithImages } from "@/actions";
import {
  Pagination,
  ProductGrid,
  Title,
  ProductTypeNavbar,
} from "@/components";
import { Gender } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";

const labels: Record<Gender, string> = {
  men: "para hombres",
  women: "para mujeres",
  kid: "para niños",
  unisex: "para todos",
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

  // Obtenemos productos y categorías en paralelo para mayor velocidad
  const [{ products, totalPages }, categories] = await Promise.all([
    getPaginatedProductsWithImages({
      page: currentPage,
      gender,
      categoryId: categoryId,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <Title
        title={`Artículos ${labels[gender] || "Generales"}`}
        subtitle="Filtra por categoría"
        className="px-3 sm:px-5"
      />

      {/* El Navbar ahora recibe las categorías de la DB */}
      <ProductTypeNavbar
        gender={gender}
        currentCategory={categoryId}
        categories={categories}
      />

      <div className="px-3 sm:px-5">
        {products.length === 0 ? (
          <div className="text-center mt-10 text-gray-500">
            No hay productos en esta categoría para {labels[gender]}.
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>

      <Pagination totalPages={totalPages} />
    </>
  );
}
