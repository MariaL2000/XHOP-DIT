/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../lib/prisma";
import { initialData } from "./seed";
import { countries } from "./seed-countries";

async function main() {
  // 1. Borrar registros previos en orden correcto para evitar conflictos de Foreign Keys
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const { categories, products, users } = initialData;

  // 2. Insertar Usuarios
  await prisma.user.createMany({
    data: users,
  });

  // 3. Insertar Países
  await prisma.country.createMany({
    data: countries,
  });

  // 4. Insertar Categorías
  const categoriesData = categories.map((name) => ({ name }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce(
    (map, category) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    },
    {} as Record<string, string>,
  ); // <string=nombre_categoria, string=categoryID>

  // 5. Insertar Productos y sus Imágenes
  for (const product of products) {
    const { type, images, ...rest } = product;

    // Buscamos el ID de la categoría correspondiente al tipo del producto
    const categoryId = categoriesMap[type] || categoriesMap["clothes"];

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        type: type as any,
        categoryId: categoryId,
      },
    });

    // Images
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  }

  console.log("Seed ejecutado correctamente");
}

// 🟢 BLOQUE FINAL CORREGIDO
(async () => {
  if (process.env.NODE_ENV === "production") return;

  try {
    await main();
  } catch (e) {
    console.error("Error al ejecutar el seed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
