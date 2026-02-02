"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoCartOutline, IoMenuOutline, IoSearchOutline } from "react-icons/io5";
import { useCartStore, useUIStore } from "@/store";
import { useMounted } from "@/hooks/useMounted";
import { SearchBar, LogoBrand } from "@/components";
import clsx from "clsx";

export const TopMenu = () => {
  const pathname = usePathname();
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  const mounted = useMounted();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const isActive = (path: string) => pathname.startsWith(path);

  const genderLinks = [
    { href: "/gender/men", label: "Hombres" },
    { href: "/gender/women", label: "Mujeres" },
    { href: "/gender/kid", label: "Niños" },
    { href: "/gender/unisex", label: "Unisex" },
  ];

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-gray-200 shadow-md py-2"
          : "bg-white py-4 border-b border-gray-100",
      )}
    >
      <div className="max-w-360 mx-auto">
        {/* NIVEL SUPERIOR: Logo, Buscador (Desktop) y Botones */}
        <div className="flex px-4 sm:px-8 justify-between items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="group relative shrink-0 transition-transform hover:scale-105"
          >
            <LogoBrand fontSize="text-xl sm:text-2xl" />
          </Link>

          {/* Buscador Central */}
          <div className="hidden md:block flex-1 max-w-md transition-all">
            <SearchBar />
          </div>

          {/* Acciones Derecha */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <IoSearchOutline size={22} />
            </button>

            <Link
              href={totalItemsInCart === 0 ? "/empty" : "/cart"}
              className="group relative p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              {totalItemsInCart > 0 && (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-(--brand-black) text-[10px] font-bold text-white shadow-lg ring-2 ring-white">
                  {totalItemsInCart}
                </span>
              )}
              <IoCartOutline className="w-6 h-6 text-gray-700 group-hover:text-(--brand-black)" />
            </Link>

            {/* Botón de Menú con variable Brand Black y Hover Primary */}
            <button
              onClick={openSideMenu}
              style={{ backgroundColor: "var(--brand-black)" }}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 text-white rounded-full hover:bg-(--brand-primary) transition-all shadow-md active:scale-95"
            >
              <IoMenuOutline size={24} />
            </button>
          </div>
        </div>

        {/* NIVEL INFERIOR: Géneros */}
        <div className="mt-4 md:mt-0 px-4">
          <div
            className={clsx(
              "flex items-center gap-1 overflow-x-auto no-scrollbar py-2 md:justify-center lg:static",
              "lg:bg-transparent lg:p-0",
            )}
          >
            <div className="flex bg-gray-100/50 lg:bg-gray-100/30 p-1 rounded-full border border-gray-200/50">
              {genderLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "relative px-5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap group/link",
                    isActive(item.href)
                      ? "bg-white text-(--brand-black) shadow-sm font-bold"
                      : "text-gray-500 hover:text-(--brand-black)",
                  )}
                >
                  <span className="relative z-10">{item.label}</span>

                  {/* Rayita debajo (Efecto Hover) */}
                  <span
                    className={clsx(
                      "absolute bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-(--brand-black) transition-all duration-300",
                      isActive(item.href)
                        ? "w-0"
                        : "w-0 group-hover/link:w-1/2",
                    )}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
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
    </nav>
  );
};
