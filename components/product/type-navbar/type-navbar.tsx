"use client";

import Link from "next/link";
import clsx from "clsx";
import { IoFilterOutline } from "react-icons/io5";

interface Category {
  id: string;
  name: string;
}

interface Props {
  gender: string;
  currentCategory?: string;
  categories: Category[];
}

export const ProductTypeNavbar = ({
  gender,
  currentCategory,
  categories,
}: Props) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-18 sm:top-22 z-30 transition-all">
      <div className="max-w-360 mx-auto flex items-center px-4 sm:px-8 py-3 gap-4">
        <div className="hidden md:flex items-center gap-2 text-(--brand-black) mr-2 opacity-80">
          <IoFilterOutline size={18} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Filtrar
          </span>
        </div>

        {/* Contenedor de Filtros con Scroll Horizontal */}
        <nav className="flex-1 flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {/* Botón "Todos" */}
          <Link
            href={`/gender/${gender}`}
            className={clsx(
              "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap border",
              {
                "bg-(--brand-black) text-white border-(--brand-black) shadow-md":
                  !currentCategory,
                "bg-white text-gray-500 border-gray-100 hover:border-(--brand-black) hover:text-(--brand-black)":
                  currentCategory,
              },
            )}
          >
            Ver Todo
          </Link>

          {/* Categorías Dinámicas */}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/gender/${gender}?category=${cat.id}`}
              className={clsx(
                "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap border",
                {
                  "bg-(--brand-black) text-white border-(--brand-black) shadow-md":
                    currentCategory === cat.id,
                  "bg-white text-gray-500 border-gray-100 hover:border-(--brand-black) hover:text-(--brand-black)":
                    currentCategory !== cat.id,
                },
              )}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
