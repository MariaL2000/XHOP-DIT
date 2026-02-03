"use server";

import { prisma } from "@/lib/prisma";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { revalidatePath } from "next/cache";
import { Gender, Size, Prisma } from "@/app/generated/prisma";
import { z } from "zod";

cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string(),
  price: z.coerce.number().min(0),
  inStock: z.coerce.number().min(0),
  categoryId: z.string().uuid(),
  sizes: z.array(z.nativeEnum(Size)).optional().default([]),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  try {
    const raw = Object.fromEntries(formData.entries());

    const dataToValidate = {
      ...raw,
      sizes:
        typeof raw.sizes === "string" && raw.sizes.length > 0
          ? raw.sizes.split(",")
          : [],
    };

    const parsed = productSchema.safeParse(dataToValidate);

    if (!parsed.success) {
      return {
        ok: false,
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    const { id, tags, ...rest } = parsed.data;

    const normalizedSlug = rest.slug.toLowerCase().replace(/ /g, "-").trim();

    const prismaData: Prisma.ProductUncheckedCreateInput = {
      ...rest,
      slug: normalizedSlug,
      tags: tags.split(",").map((t) => t.trim().toLowerCase()),
    };

    const product = id
      ? await prisma.product.update({
          where: { id },
          data: prismaData,
        })
      : await prisma.product.create({
          data: prismaData,
        });

    const imagesFiles = formData.getAll("images") as File[];

    if (imagesFiles.length > 0) {
      const existingCount = await prisma.productImage.count({
        where: { productId: product.id },
      });

      const availableSlots = 2 - existingCount;

      if (availableSlots > 0) {
        const imagesToUpload = imagesFiles
          .filter((file) => file.size > 0)
          .slice(0, availableSlots);

        const uploadedImages: Prisma.ProductImageCreateManyInput[] = [];

        for (const file of imagesToUpload) {
          const buffer = Buffer.from(await file.arrayBuffer());

          const uploadResult = await new Promise<UploadApiResponse>(
            (resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "products" },
                (error, result) =>
                  error || !result ? reject(error) : resolve(result),
              );

              stream.end(buffer);
            },
          );

          uploadedImages.push({
            url: uploadResult.secure_url,
            productId: product.id,
          });
        }

        if (uploadedImages.length > 0) {
          await prisma.productImage.createMany({
            data: uploadedImages,
          });
        }
      }
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);

    return { ok: true };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "No se pudo guardar el producto",
    };
  }
};
