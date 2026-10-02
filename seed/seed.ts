import bcryptjs from "bcryptjs";

interface SeedProduct {
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: ValidSizes[];
  slug: string;
  tags: string[];
  title: string;
  type: ValidTypes;
  gender:
    | "men"
    | "women"
    | "kid"
    | "unisex"
    | "food"
    | "technologies"
    | "books";
}

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
}

type ValidSizes = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
type ValidTypes = "clothes" | "accessories" | "books" | "food" | "technologies";

interface SeedData {
  users: SeedUser[];
  categories: string[];
  products: SeedProduct[];
}

export const initialData: SeedData = {
  users: [
    {
      email: process.env.ADMIN_EMAIL || "lesyani@gmail.com",
      name: process.env.ADMIN_NAME || "Lesyani Maria",
      password: bcryptjs.hashSync(process.env.ADMIN_PASSWORD || "123456"),
      role: "admin",
    },
    {
      email: "melissa@google.com",
      name: "Melissa Flores",
      password: bcryptjs.hashSync("123456"),
      role: "user",
    },
  ],

  categories: [
    "clothes",
    "technologies",
    "home",
    "accessories",
    "food",
    "books",
  ],

  products: [
    {
      description:
        "Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season.",
      images: ["1740176-00-A_0_2000.jpg", "1740176-00-A_1.jpg"],
      inStock: 7,
      price: 75,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      slug: "mens_chill_crew_neck_sweatshirt",
      type: "clothes",
      tags: ["sweatshirt"],
      title: "Men’s Chill Crew Neck Sweatshirt",
      gender: "men",
    },
    {
      description: "Delicioso café orgánico de especialidad en grano de 500g.",
      images: ["1703767-00-A_0_2000.jpg", "1703767-00-A_1.jpg"],
      inStock: 20,
      price: 15,
      sizes: [],
      slug: "cafe_organico_especialidad",
      type: "food",
      tags: ["cafe", "comida"],
      title: "Café Orgánico de Especialidad 500g",
      gender: "food",
    },
    {
      description:
        "Libro de desarrollo web moderno y buenas prácticas con Next.js.",
      images: ["1740280-00-A_0_2000.jpg", "1740280-00-A_1.jpg"],
      inStock: 10,
      price: 30,
      sizes: [],
      slug: "libro_desarrollo_web_nextjs",
      type: "books",
      tags: ["libros", "programacion"],
      title: "Guía Definitiva de Next.js",
      gender: "books",
    },
  ],
};
