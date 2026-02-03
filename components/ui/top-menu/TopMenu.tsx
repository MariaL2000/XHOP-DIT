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
    const handleScroll = () => setScrolled(window.scrollY > 10);
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
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all">
      <div
        className={clsx(
          "max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 transition-all",
          scrolled ? "h-14" : "h-16",
        )}
      >
        <Link href="/" className="hover:opacity-80 transition-opacity shrink-0">
          <LogoBrand fontSize="text-xl sm:text-2xl" />
        </Link>

        <div className="hidden md:block flex-1 max-w-2xl">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            {isSearchOpen ? (
              <IoCloseOutline size={24} />
            ) : (
              <IoSearchOutline size={24} />
            )}
          </button>

          <Link
            href={totalItemsInCart === 0 ? "/empty" : "/cart"}
            className="relative p-2 text-gray-700"
          >
            {totalItemsInCart > 0 && (
              <span className="absolute top-0 right-0 bg-(--brand-black) text-white text-[10px] px-1.5 rounded-full font-bold">
                {totalItemsInCart}
              </span>
            )}
            <IoCartOutline size={26} />
          </Link>

          <button
            onClick={openSideMenu}
            className="flex items-center gap-1 p-1 sm:p-2 bg-(--brand-black) text-white rounded-full sm:rounded-lg transition-transform active:scale-95"
          >
            <IoMenuOutline size={24} />
          </button>
        </div>
      </div>

      <div
        className={clsx(
          "md:hidden px-4 bg-white transition-all duration-300",

          isSearchOpen
            ? "opacity-100 h-auto py-3 border-t border-gray-100 visible"
            : "opacity-0 h-0 overflow-hidden invisible",
        )}
      >
        <SearchBar onResultClick={() => setIsSearchOpen(false)} />
      </div>

      <div className="w-full bg-(--brand-black) text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-12 overflow-x-auto no-scrollbar gap-6 text-xs font-bold uppercase tracking-wider">
          {genderLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "hover:text-white/80 transition-colors whitespace-nowrap py-2 border-b-2",
                pathname === link.href ? "border-white" : "border-transparent",
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
