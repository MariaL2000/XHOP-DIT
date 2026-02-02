/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth.config";
import type { Address } from "@/interfaces";
import { Size } from "@/app/generated/prisma";

// Producto a ordenar
export interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

// Tipos de respuesta
export interface PlaceOrderSuccess {
  ok: true;
  order: {
    id: string;
    itemsInOrder: number;
    subTotal: number;
    tax: number;
    total: number;
    isPaid: boolean;
    paidAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
  orderAddress: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    countryId: string;
    phone: string;
    orderId: string;
  };
}

export interface PlaceOrderError {
  ok: false;
  message: string;
}

// Union type de respuesta
export type PlaceOrderResponse = PlaceOrderSuccess | PlaceOrderError;

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address,
): Promise<PlaceOrderResponse> => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) return { ok: false, message: "No hay sesión de usuario" };

  console.log("ProductIds recibidos:", productIds);

  // Obtener productos
  const products = await prisma.product.findMany({
    where: { id: { in: productIds.map((p) => p.productId) } },
  });
  console.log("Productos encontrados en DB:", products);

  if (products.length === 0) {
    return { ok: false, message: "No se encontraron productos" };
  }

  // Calcular totales
  let subTotal = 0;
  const itemsInOrder = productIds.reduce((sum, p) => sum + p.quantity, 0);

  for (const item of productIds) {
    const product = products.find((p) => p.id === item.productId);
    if (!product)
      return { ok: false, message: `Producto ${item.productId} no existe` };
    subTotal += product.price * item.quantity;
  }
  const tax = subTotal * 0.15;
  const total = subTotal + tax;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar stock
      for (const item of productIds) {
        const product = products.find((p) => p.id === item.productId)!;
        if (product.inStock < item.quantity) {
          return {
            ok: false,
            message: `${product.title} no tiene stock suficiente`,
          };
        }
        await tx.product.update({
          where: { id: product.id },
          data: { inStock: { decrement: item.quantity } },
        });
      }

      // Crear orden
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subTotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
                size: p.size,
                price: products.find((prod) => prod.id === p.productId)!.price,
              })),
            },
          },
        },
      });

      const { country, ...restAddress } = address;
      const orderAddress = await tx.orderAddress.create({
        data: { ...restAddress, countryId: country, orderId: order.id },
      });

      return { ok: true, order, orderAddress };
    });

    return result as PlaceOrderResponse;
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message || "Error interno al colocar la orden",
    };
  }
};
