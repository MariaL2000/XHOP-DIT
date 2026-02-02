import { deleteProduct } from "@/actions/product/delete-product";
import { NextResponse } from "next/server";
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "ID no recibido" }, { status: 400 });
  }

  const res = await deleteProduct(id);

  if (!res.ok) {
    return NextResponse.json(
      { message: res.message ?? "Error eliminando producto" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
