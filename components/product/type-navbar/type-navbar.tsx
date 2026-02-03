"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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

export const ProductTypeNavbar = ({ gender, categories }: Props) => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div
      className={clsx(
        "w-full bg-white/95 backdrop-blur-md border-b border-gray-200 sticky transition-all duration-75",
        "z-30",
        "top-25.75 md:top-[103.5px]",
        "-mt-px pt-px",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center px-4 h-14 gap-3">
        <div className="flex items-center gap-2 text-(--brand-black) shrink-0 scale-90 sm:scale-100">
          <IoFilterOutline size={20} />
          <span className="hidden xs:inline text-[10px] font-black uppercase tracking-[0.2em]">
            Filtros
          </span>
        </div>

        <nav
          className={clsx(
            "flex-1 flex items-center gap-2 overflow-x-auto py-1",
            "no-scrollbar snap-x snap-proximity touch-pan-x",
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <Link
            href={`/gender/${gender}`}
            className={clsx(
              "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all shrink-0 snap-start",
              !currentCategory
                ? "bg-(--brand-black) text-white border-(--brand-black) shadow-md"
                : "bg-gray-50 text-gray-400 border-(--brand-black)/10",
            )}
          >
            Todo
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/gender/${gender}?category=${cat.id}`}
              className={clsx(
                "px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all shrink-0 snap-start whitespace-nowrap",
                currentCategory === cat.id
                  ? "bg-(--brand-black) text-white border-(--brand-black) shadow-md"
                  : "bg-gray-50 text-gray-400 border-(--brand-black)/10",
              )}
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
