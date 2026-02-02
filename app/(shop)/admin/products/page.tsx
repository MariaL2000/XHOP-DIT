export const revalidate = 0;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, Title } from "@/components";
import Link from "next/link";
import ProductTable from "@/components/ProductTableAdmin";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <Title title="Mantenimiento de productos" />

      <div className="flex justify-end mb-5">
        <Link
          href="/admin/product/new"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="mb-10 overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Imagen</th>
              <th className="px-4 py-3 text-left">Título</th>
              <th className="px-4 py-3 text-left">Precio</th>
              <th className="px-4 py-3 text-left">Género</th>
              <th className="px-4 py-3 text-left">Inventario</th>
              <th className="px-4 py-3 text-left">Tallas</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>

          <ProductTable products={products} />
        </table>

        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
