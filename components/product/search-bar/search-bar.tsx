"use client";

import { useState, useEffect, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { getProductsByTerm } from "@/actions";
import Link from "next/link";

export const SearchBar = () => {
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
    const timer = setTimeout(search, 300); // Debounce
    return () => clearTimeout(timer);
  }, [term]);

  return (
    <div
      className="relative flex-1 max-w-lg mx-4 hidden md:block"
      ref={containerRef}
    >
      <div className="relative group">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full bg-white border border-(--brand-black) rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-(--brand-primary)/30 transition-all placeholder:text-gray-400 text-sm"
        />
        <IoSearchOutline
          className="absolute left-3 top-2.5 text-(--brand-black) group-focus-within:text-(--brand-primary) transition-colors"
          size={18}
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl border border-(--brand-black) rounded-2xl shadow-2xl z-100 overflow-hidden">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={() => {
                setTerm("");
                setShowResults(false);
              }}
              className="block px-4 py-3 hover:bg-(--brand-primary) hover:text-white transition-all text-sm border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-2">
                <IoSearchOutline size={14} className="opacity-50" />
                {product.title}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
