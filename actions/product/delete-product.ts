/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");
export const deleteProduct = async (productId: string) => {
  if (!productId) {
    throw new Error("productId inválido");
  }

  try {
    const images = await prisma.productImage.findMany({
      where: { productId },
    });

    for (const img of images) {
      if (img.url.startsWith("http")) {
        const name = img.url.split("/").pop()?.split(".")[0];
        if (name) {
          await cloudinary.uploader.destroy(name);
        }
      }
    }

    await prisma.productImage.deleteMany({
      where: { productId },
    });

    await prisma.product.update({
      where: { id: productId },
      data: { deleted: true },
    });

    revalidatePath("/admin/products");

    return { ok: true };
  } catch (error: any) {
    console.error("Error al eliminar producto:", error);
    return { ok: false, message: error.message };
  }
};
