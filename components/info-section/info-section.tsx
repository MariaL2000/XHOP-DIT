"use client";

import Image from "next/image";
import { Title } from "@/components"; // Ajusta la ruta según tu proyecto
import { LogoBrand } from "@/components";

export const InfoSection = () => {
  const cards = [
    {
      title: "Calidad Premium",
      desc: "Telas seleccionadas para durabilidad y confort máximo.",
      image: "/banners/Info1.jpg", // Ajusta a tus nombres reales
    },
    {
      title: "Diseño Exclusivo",
      desc: "Ediciones limitadas que no encontrarás en otro lugar.",
      image: "/banners/Info2.png",
    },
    {
      title: "Envío Rápido",
      desc: "Logística optimizada para que estrenes lo antes posible.",
      image: "/banners/Info3.png",
    },
  ];

  return (
    <section className="py-15 px-4 sm:px-8 lg:px-10 fade-in">
      {/* Encabezado con Brand Logo y Title */}
      <div className="text-center mb-12 space-y-2">
        <div className="flex justify-center mb-4">
          <LogoBrand fontSize="text-6xl md:text-8xl" />
        </div>

        <Title
          title="Nuestra Esencia"
          subtitle="¿Por qué XHOP'DIT es tu mejor elección?"
          className="mb-0"
        />

        <div
          className="w-24 h-1.5 mx-auto mt-6 rounded-full"
          style={{ backgroundColor: "var(--brand-primary)" }}
        />
      </div>

      {/* Grid de Cards con Imágenes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-360 mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group relative h-100 md:h-112.5 lg:h-125 overflow-hidden rounded-3xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
          >
            {/* Imagen de Fondo */}
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />

            {/* Overlay de Degradado (para legibilidad del texto) */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Contenido de Texto en la parte inferior */}
            <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500">
              <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase italic">
                {card.title}
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {card.desc}
              </p>

              {/* Línea decorativa que crece al hacer hover */}
              <div
                className="h-1 w-0 group-hover:w-full transition-all duration-700 mt-4 rounded-full"
                style={{ backgroundColor: "var(--brand-primary)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
