"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  IoSearchOutline,
  IoCloseOutline,
  IoReloadOutline,
} from "react-icons/io5";
import { getProductsByTerm } from "@/actions";
import clsx from "clsx";

interface Props {
  className?: string;
  onResultClick?: () => void;
}

export const SearchBar = ({ className, onResultClick }: Props) => {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<
    { id: string; title: string; slug: string }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const search = async () => {
      const cleanTerm = term.trim();
      if (cleanTerm.length > 1) {
        setIsSearching(true);
        try {
          const products = await getProductsByTerm(cleanTerm);
          setResults(products || []);
          setShowResults(true);
        } catch (error) {
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    };

    const timer = setTimeout(search, 400);
    return () => clearTimeout(timer);
  }, [term]);

  const onNavigate = (slug: string) => {
    setShowResults(false);
    setTerm("");
    if (onResultClick) onResultClick();
    router.push(`/product/${slug}`);
  };

  return (
    <div
      className={clsx("relative w-full", className)}
      ref={containerRef}
      style={{ zIndex: 9999 }}
    >
      <div className="relative">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar productos..."
          className={clsx(
            "w-full bg-gray-50 rounded-full py-3 pl-10 pr-10 text-base outline-none transition-all duration-300",

            "border border-(--brand-black)/10",

            "focus:bg-white focus:border-(--brand-black) focus:ring-4 focus:ring-(--brand-black)/5",
          )}
          autoComplete="off"
        />

        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {isSearching ? (
            <IoReloadOutline
              className="animate-spin text-(--brand-black)"
              size={18}
            />
          ) : (
            <IoSearchOutline
              size={20}
              className="group-focus-within:text-(--brand-black)"
            />
          )}
        </div>

        {term && (
          <button
            type="button"
            onClick={() => {
              setTerm("");
              setShowResults(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-(--brand-black)"
          >
            <IoCloseOutline size={20} />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-(--brand-black)/10 z-10000 overflow-hidden">
          <div className="max-h-[60vh] overflow-y-auto py-2 overscroll-contain bg-white">
            {results.length > 0
              ? results.map((product) => (
                  <button
                    key={product.id}
                    onPointerDown={() => onNavigate(product.slug)}
                    className="flex flex-col w-full text-left px-5 py-4 hover:bg-gray-50 active:bg-gray-100 border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <span className="text-sm text-black font-bold pointer-events-none">
                      {product.title}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase pointer-events-none">
                      Ver producto
                    </span>
                  </button>
                ))
              : !isSearching && (
                  <div className="px-5 py-8 text-center text-gray-500 text-sm">
                    No hay resultados para "{term}"
                  </div>
                )}
          </div>
        </div>
      )}
    </div>
  );
};
