import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export default function EmptyPage() {
  return (
    <div className="flex flex-col sm:flex-row h-[calc(100vh-100px)] items-center justify-center px-4 gap-6">
      {/* Icono adaptable */}
      <IoCartOutline
        size={100}
        className="text-gray-300 sm:mx-5 animate-pulse"
      />

      {/* Contenido de texto */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Tu carrito está vacío
        </h1>

        <Link
          href="/"
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95"
        >
          Regresar a la tienda
        </Link>
      </div>
    </div>
  );
}
