"use client";
import type { Size } from "@/app/generated/prisma";
import clsx from "clsx";

interface Props {
  selectedSize?: Size;
  availableSizes: Size[];
  onSizeChanged: (size: Size) => void;
}

export const SizeSelector = ({
  selectedSize,
  availableSizes,
  onSizeChanged,
}: Props) => {
  return (
    <div className="my-6">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
        Tallas disponibles
      </h3>

      <div className="flex flex-wrap gap-3">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChanged(size)}
            className={clsx(
              "min-w-11.25 h-11.25 flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 border uppercase tracking-tighter active:scale-90",
              {
                "bg-(--brand-black) text-white border-(--brand-black) shadow-lg shadow-gray-200":
                  size === selectedSize,
                "bg-white text-gray-500 border-gray-200 hover:border-(--brand-black) hover:text-(--brand-black)":
                  size !== selectedSize,
              },
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
