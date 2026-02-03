"use client";

import { useState, useEffect, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { getProductsByTerm } from "@/actions";
import Link from "next/link";
import clsx from "clsx";

interface Props {
  className?: string;
  onResultClick?: () => void;
}

export const SearchBar = ({ className, onResultClick }: Props) => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<
    { id: string; title: string; slug: string }[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const search = async () => {
      if (term.trim().length > 1) {
        const products = await getProductsByTerm(term);
        setResults(products);
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    };
    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [term]);

  return (
    <div className={clsx("relative w-full", className)} ref={containerRef}>
      <div className="relative group">
        <input
          type="text"
          autoComplete="off"
          inputMode="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/10 text-base md:text-sm"
        />
        <IoSearchOutline
          className="absolute left-3 top-3 text-gray-400"
          size={20}
        />
      </div>

      {showResults && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-110 max-h-[70vh] overflow-y-auto">
          {results.length > 0 ? (
            results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={() => {
                  setTerm("");
                  setShowResults(false);
                  if (onResultClick) onResultClick();
                }}
                className="block px-5 py-4 hover:bg-gray-50 active:bg-gray-100 transition-all text-sm border-b border-gray-50 last:border-0"
              >
                {product.title}
              </Link>
            ))
          ) : (
            <div className="px-5 py-4 text-gray-500 text-sm italic">
              No se encontraron resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
};
