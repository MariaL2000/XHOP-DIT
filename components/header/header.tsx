/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const slides = [
  {
    url: "/banners/x2.png",
    alt: "Ofertas Exclusivas XHOP'DIT",
  },
  {
    url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1920&auto=format&fit=crop",
    alt: "Nueva Colección Streetwear - XHOP'DIT",
  },
  {
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1920&auto=format&fit=crop",
    alt: "Estilo Urbano 2026",
  },
];

export const HomeSlider = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="px-2 sm:px-6 lg:px-8 py-2 sm:py-4 fade-in">
      <div className="relative w-full h-62.5 sm:h-95 md:h-105 lg:h-112.5 xl:h-125 overflow-hidden rounded-xl sm:rounded-4xl group shadow-lg bg-gray-100">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              index === current
                ? "opacity-100 scale-100 visible"
                : "opacity-0 scale-102 invisible"
            }`}
          >
            <Image
              src={slide.url}
              alt={slide.alt}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className={`object-cover object-center select-none transition-opacity duration-500 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
              draggable={false}
              {...(index === 0 && ({ fetchPriority: "high" } as any))}
            />

            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>
        ))}

        {/* Controles */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 hidden md:flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black z-30"
          aria-label="Anterior"
        >
          <IoChevronBackOutline size={22} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 hidden md:flex items-center justify-center bg-white/20 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black z-30"
          aria-label="Siguiente"
        >
          <IoChevronForwardOutline size={22} />
        </button>

        {/* Indicadores */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="py-2 focus:outline-none"
            >
              <div
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === current ? "w-8 bg-white" : "w-3 bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
