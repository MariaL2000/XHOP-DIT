"use client";

import { IoAddOutline, IoRemoveOutline } from "react-icons/io5";
import clsx from "clsx";

interface Props {
  quantity: number;
  onQuantityChanged: (value: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {
  const onValueChanged = (value: number) => {
    if (quantity + value < 1) return;
    onQuantityChanged(quantity + value);
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center bg-gray-100/80 backdrop-blur-sm rounded-full p-1 border border-gray-200 shadow-inner">
        {/* Botón Menos */}
        <button
          onClick={() => onValueChanged(-1)}
          className={clsx(
            "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 active:scale-90",
            quantity <= 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-(--brand-black) hover:bg-white hover:shadow-sm",
          )}
          disabled={quantity <= 1}
        >
          <IoRemoveOutline size={22} />
        </button>

        {/* Cantidad */}
        <span className="w-12 text-center text-sm font-black text-(--brand-black) select-none tabular-nums">
          {quantity}
        </span>

        {/* Botón Más */}
        <button
          onClick={() => onValueChanged(+1)}
          className="flex items-center justify-center w-10 h-10 rounded-full text-(--brand-black) transition-all duration-200 hover:bg-white hover:shadow-sm active:scale-90"
        >
          <IoAddOutline size={22} />
        </button>
      </div>

      <span className="ml-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hidden sm:block">
        Cantidad
      </span>
    </div>
  );
};
