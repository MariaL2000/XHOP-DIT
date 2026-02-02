import { Gender, Size, ProductType } from "@/app/generated/prisma";

export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  gender: Gender;
  type: ProductType;
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
}

export interface ProductImage {
  id: number;
  url: string;
  productId: string;
}
