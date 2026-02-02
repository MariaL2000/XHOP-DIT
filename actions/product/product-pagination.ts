"use server";

import { prisma } from "@/lib/prisma";
import { Gender, ProductType } from "@/app/generated/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
  type?: ProductType; // <-- Agregamos esto
  categoryId?: string;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
  categoryId,
}: PaginationOptions) => {
  if (page < 1) page = 1;

  const where = {
    deleted: false,
    ...(gender && { gender }),
    ...(categoryId && { categoryId }), // Prisma filtrará por el ID de la categoría
  };

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      take,
      skip: (page - 1) * take,
      where,
      include: {
        ProductImage: {
          take: 2,
          select: { url: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const mappedProducts = products.map((p) => ({
    ...p,
    images:
      p.ProductImage.length > 0
        ? p.ProductImage.map((img) => img.url)
        : ["/imgs/placeholder.jpg"],
  }));

  return {
    currentPage: page,
    totalPages: Math.ceil(totalCount / take),
    products: mappedProducts,
  };
};
