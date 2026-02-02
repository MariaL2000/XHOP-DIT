export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Home({ searchParams }: Props) {
  const { page } = await searchParams;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page: page ? parseInt(page) : 1,
  });

  return (
    <div className="py-8">
      {/* El título se adapta al contexto */}
      <Title
        title="Colección Destacada"
        subtitle="Los favoritos de la comunidad XHOP'DIT"
        className="mb-8"
      />

      <ProductGrid products={products} />

      <div className="mt-10">
        {totalPages && <Pagination totalPages={totalPages} />}
      </div>
    </div>
  );
}
