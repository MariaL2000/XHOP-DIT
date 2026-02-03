export const revalidate = 0;

import { getOrdersByUser } from "@/actions";
import { Title } from "@/components";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline, IoChevronForwardOutline } from "react-icons/io5";
import clsx from "clsx";

export default async function OrdersPage() {
  const { ok, orders = [] } = await getOrdersByUser();

  if (!ok) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 mb-10">
      <Title title="Mis Órdenes" />

      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block bg-white border border-(--brand-black)/10 rounded-xl p-3 active:bg-gray-50 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="min-w-0">
                {" "}
                <span className="block text-[9px] uppercase tracking-tighter text-gray-400 font-bold leading-none mb-1">
                  ID Pedido
                </span>
                <span className="text-sm font-black text-(--brand-black) truncate">
                  #{order.id.split("-").at(-1)}
                </span>
              </div>

              <div
                className={clsx(
                  "shrink-0 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tight border",
                  order.isPaid
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200",
                )}
              >
                {order.isPaid ? "PAGADO" : "PENDIENTE"}
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-gray-50 pt-2">
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-medium leading-none mb-1">
                  Cliente
                </p>
                <p className="text-xs text-gray-700 font-bold truncate">
                  {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
                </p>
              </div>

              <div className="flex items-center gap-1 text-(--brand-black) font-bold text-[10px] uppercase tracking-widest shrink-0 bg-gray-100 px-2 py-1 rounded">
                Detalles <IoChevronForwardOutline size={12} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden md:block overflow-hidden rounded-2xl border border-(--brand-black)/10 bg-white shadow-sm">
        <table className="min-w-full">
          <thead className="bg-(--brand-black) text-white">
            <tr>
              <th className="text-[11px] font-black uppercase tracking-widest px-6 py-4 text-left">
                #ID
              </th>
              <th className="text-[11px] font-black uppercase tracking-widest px-6 py-4 text-left">
                Cliente
              </th>
              <th className="text-[11px] font-black uppercase tracking-widest px-6 py-4 text-left">
                Estado
              </th>
              <th className="text-[11px] font-black uppercase tracking-widest px-6 py-4 text-right pr-10">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-(--brand-black)">
                  #{order.id.split("-").at(-1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={clsx(
                      "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      order.isPaid
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-red-50 text-red-700 border-red-100",
                    )}
                  >
                    <IoCardOutline className="mr-1.5" size={14} />
                    {order.isPaid ? "Pagada" : "No Pagada"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-block bg-white border border-(--brand-black)/20 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-(--brand-black) hover:text-white transition-all shadow-sm"
                  >
                    Ver detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
