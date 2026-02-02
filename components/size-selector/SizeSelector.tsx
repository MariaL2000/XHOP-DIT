"use client";

import { Size } from "@/app/generated/prisma";

interface Props {
  selectedSize: Size;
  availableSizes: Size[];
  onSizeChange: (size: Size) => void;
}

export const SizeSelector = ({
  selectedSize,
  availableSizes,
  onSizeChange,
}: Props) => {
  return (
    <div className="flex gap-2 my-5">
      {availableSizes.map((size) => (
        <button
          key={size}
          onClick={() => onSizeChange(size)}
          className={`
            px-3 py-1 border rounded
            ${selectedSize === size ? "bg-black text-white" : ""}
          `}
        >
          {size}
        </button>
      ))}
    </div>
  );
};
