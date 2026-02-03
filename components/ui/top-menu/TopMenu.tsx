"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoCartOutline,
  IoMenuOutline,
  IoSearchOutline,
  IoCloseOutline,
} from "react-icons/io5";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const genderLinks = [
    { href: "/gender/men", label: "Hombres" },
    { href: "/gender/women", label: "Mujeres" },
    { href: "/gender/kid", label: "Niños" },
    { href: "/gender/unisex", label: "Unisex" },
  ];

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 w-full transition-all duration-300 bg-white",
        scrolled ? "shadow-md py-2" : "py-4",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Fila Principal */}
        <div className="flex justify-between items-center gap-4">
          <Link
            href="/"
            className="hover:scale-105 transition-transform shrink-0"
          >
            <LogoBrand fontSize="text-xl sm:text-2xl" />
          </Link>

          <SearchBar className="hidden md:block flex-1 max-w-md" />

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isSearchOpen ? (
                <IoCloseOutline size={24} />
              ) : (
                <IoSearchOutline size={24} />
              )}
            </button>

            <Link
              href={totalItemsInCart === 0 ? "/empty" : "/cart"}
              className="relative p-2"
            >
              {totalItemsInCart > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[10px] px-1.5 rounded-full font-bold">
                  {totalItemsInCart}
                </span>
              )}
              <IoCartOutline size={24} />
            </Link>

            <button
              onClick={openSideMenu}
              className="p-2 bg-black text-white rounded-full hover:opacity-80 transition-all ml-1"
            >
              <IoMenuOutline size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Search - Slide down */}
        <div
          className={clsx(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isSearchOpen ? "max-h-20 opacity-100 mt-4" : "max-h-0 opacity-0",
          )}
        >
          <SearchBar onResultClick={() => setIsSearchOpen(false)} />
        </div>

        {/* Categorías - Hacemos que sea un scroll horizontal en mobile para ahorrar espacio vertical */}
        <div className="flex justify-center md:justify-center gap-2 sm:gap-4 mt-4 text-xs sm:text-sm font-medium overflow-x-auto no-scrollbar whitespace-nowrap pb-1">
          {genderLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "hover:text-black transition-colors px-2 py-1 shrink-0",
                pathname === link.href
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
