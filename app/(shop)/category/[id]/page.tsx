import { notFound } from "next/navigation";
import { ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const validCategories = ["men", "women", "kid", "unisex"] as const;
type Category = (typeof validCategories)[number];

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;

  // Normalizamos el id
  let category: Category;

  if (id === "kids") {
    category = "kid";
  } else if (validCategories.includes(id as Category)) {
    category = id as Category;
  } else {
    notFound();
  }

  const products = initialData.products.filter(
    (product) => product.gender === category
  );

  return (
    <>
      <Title
        title={`Artículos ${
          {
            men: "para hombres",
            women: "para mujeres",
            kid: "para niños",
            unisex: "para todos",
          }[category]
        }`}
        subtitle="Todos los productos"
        className="mb-2"
      />
      <ProductGrid products={products} />
    </>
  );
}
