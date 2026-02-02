"use server";

import { prisma } from "@/lib/prisma";

export const getProductsByTerm = async (term: string) => {
  if (term.length < 2) return [];

  try {
    const products = await prisma.product.findMany({
      where: {
        deleted: false,
        title: { contains: term, mode: "insensitive" },
      },
      select: { id: true, title: true, slug: true },
      take: 5,
    });
    return products;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return [];
  }
};
