import Image from "next/image";
import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";

export const ModernBanner = () => {
  return (
    <div className="relative my-16 overflow-hidden rounded-4xl h-75 md:h-87.5 group shadow-sm transition-all duration-500 hover:shadow-xl">
      {/* Imagen con zoom suave */}
      <Image
        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070"
        alt="Promotion Banner"
        fill
        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
      />

      {/* Overlay con degradado lateral para legibilidad */}
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/20 to-transparent flex items-center p-8 md:p-20">
        <div className="max-w-xl animate-in fade-in slide-in-from-left-5 duration-1000">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
            <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">
              Limited Edition
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tighter">
            30% OFF <br />
            <span className="text-blue-400">Essential</span> Items
          </h2>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-6">
            <Link
              href="/gender/unisex"
              className="group/btn relative inline-flex items-center justify-center gap-2 px-8 py-3 overflow-hidden font-bold text-black bg-white rounded-full transition-all duration-300 hover:bg-blue-600 hover:text-white active:scale-95 w-fit"
            >
              <span className="text-sm uppercase tracking-wider">Shop Now</span>
              <IoArrowForward
                size={18}
                className="transition-transform group-hover/btn:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
