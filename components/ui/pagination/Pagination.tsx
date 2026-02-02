"use client";

import { generatePaginationNumbers } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface Props {
  totalPages: number;
}
export const Pagination = ({ totalPages }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageString = searchParams.get("page") ?? 1;
  const currentPage = isNaN(+pageString) ? 1 : +pageString;

  if (currentPage < 1) {
    redirect("/");
  }
  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);

    if (pageNumber === "...") {
      return `${pathname}?${params.toString()}`;
    }
    if (+pageNumber <= 0) {
      return `${pathname}`;
    }
    if (+pageNumber > totalPages) {
      return `${pathname}?${params.toString()}`;
    }

    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePaginationNumbers(currentPage, totalPages);
  return (
    <div className="mt-5 mb-5 flex justify-center">
      <nav aria-label="Page navigation example">
        <ul className="list-style-none flex">
          <li>
            <Link
              href={createPageUrl(currentPage - 1)}
              className="page-link relative block rounded border-0 bg-transparent px-3 py-1.5 text-gray-800 transition-all duration-300 outline-none focus:shadow-none"
              // aria-disabled='true'
            >
              <IoChevronBackOutline />
            </Link>
          </li>
          {allPages.map((page) => (
            <li key={page}>
              <Link
                className={clsx(
                  "relative block rounded border-0 px-3 py-1.5 transition-all duration-300 outline-none focus:shadow-none",
                  {
                    "bg-blue-600 text-white hover:bg-blue-400":
                      currentPage === page,
                    "bg-transparent text-gray-800 hover:bg-blue-400 hover:text-white":
                      currentPage !== page,
                  },
                )}
                href={createPageUrl(page)}
              >
                {page}
              </Link>
            </li>
          ))}

          <li>
            <Link
              href={createPageUrl(currentPage + 1)}
              className="page-link relative block rounded border-0 bg-transparent px-3 py-1.5 text-gray-800 transition-all duration-300 outline-none hover:bg-gray-200 hover:text-gray-800 focus:shadow-none"
            >
              <IoChevronForwardOutline />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
