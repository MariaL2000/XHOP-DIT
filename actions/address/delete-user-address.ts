"use server";

import { prisma } from "@/lib/prisma";

export const deleteUserAddress = async (userId: string) => {
  try {
    // deleteMany permite borrar incluso si no existe la fila
    const deleted = await prisma.userAddress.deleteMany({
      where: { userId },
    });

    if (deleted.count === 0) {
      return {
        ok: false,
        message: "No se encontró ninguna dirección para este usuario",
      };
    }

    return { ok: true, message: "Dirección eliminada correctamente" };
  } catch (error) {
    console.error("Error eliminando la dirección:", error);
    return {
      ok: false,
      message: "No se pudo eliminar la dirección",
    };
  }
};
