/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import {
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoWhatsapp,
  IoLocationOutline,
} from "react-icons/io5";
import { LogoBrand } from "@/components";

export const Footer = () => {
  const whatsappNumber = "5351834749";

  // DEFINICIÓN DE COLORES (CSS VARIABLES INLINE)
  const brandTheme = {
    "--brand-primary": "#1d4ed8", // blue-700
    "--brand-secondary": "#3b82f6", // blue-500
    "--brand-accent": "#60a5fa", // blue-400
    "--brand-bg-soft": "#f8fafc",
  } as React.CSSProperties;

  return (
    <footer
      style={brandTheme}
      className="relative w-full bg-white pt-20 pb-10 overflow-hidden border-t border-gray-100"
    >
      {/* Rayas Decorativas Superiores usando variables */}
      <div className="absolute top-0 left-0 w-full h-1.5 flex">
        <div className="flex-1 bg-(--brand-primary)"></div>
        <div className="flex-1 bg-(--brand-secondary)"></div>
        <div className="flex-1 bg-(--brand-accent)"></div>
        <div className="flex-1 opacity-50 bg-(--brand-accent)"></div>
      </div>

      <div className="max-w-360 mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Columna 1: Brand & Social */}
          <div className="md:col-span-5 space-y-6">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <LogoBrand fontSize="text-5xl md:text-6xl" />
            </Link>

            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Elevando el{" "}
              <span className="font-bold italic text-(--brand-secondary)">
                streetwear
              </span>{" "}
              a otro nivel. Diseños exclusivos para quienes no temen destacar.
            </p>

            <div className="flex gap-4">
              {[
                { icon: <IoLogoInstagram />, href: "#" },
                { icon: <IoLogoFacebook />, href: "#" },
                { icon: <IoLogoTwitter />, href: "#" },
              ].map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-(--brand-primary) hover:text-white transition-all duration-300 shadow-sm"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-[0.2em] mb-8 flex items-center gap-2">
              <span className="w-8 h-px bg-(--brand-secondary)"></span>
              Explorar
            </h4>
            <ul className="space-y-4 text-gray-500 font-medium">
              {["Men", "Women", "Kid", "Unisex"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/gender/${item.toLowerCase()}`}
                    className="hover:text-(--brand-secondary) transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: WhatsApp & Location */}
          <div className="md:col-span-4 space-y-8">
            <h4 className="font-bold text-gray-900 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
              <span className="w-8 h-px bg-(--brand-secondary)"></span>
              Contacto
            </h4>

            <Link
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              className="group flex items-center justify-between w-full max-w-xs p-4 bg-linear-to-r from-(--brand-primary) to-(--brand-accent) rounded-2xl text-white shadow-lg transition-all hover:shadow-(--brand-accent)/30 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <IoLogoWhatsapp
                  size={24}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span className="font-bold">WhatsApp</span>
              </div>
              <span className="bg-white/20 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter">
                Online
              </span>
            </Link>

            <div className="flex items-center gap-2 text-gray-500 text-sm italic">
              <IoLocationOutline
                size={18}
                className="text-(--brand-secondary)"
              />
              <span>La Habana, Cuba</span>
            </div>
          </div>
        </div>

        {/* Línea Divisora con gradiente */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-900 font-bold">XHOP'DIT</span>. Todos los
            derechos reservados.
          </div>

          {/* Pagos con borde dinámico */}
          <div className="flex flex-wrap justify-center gap-3">
            {["EURO", "USD", "PayPal", "Transfermóvil"].map((pago) => (
              <span
                key={pago}
                className="text-[9px] font-black border-b-2 border-(--brand-accent) text-gray-500 px-1"
              >
                {pago.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Marca de agua decorativa */}
      <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-[0.03] select-none text-(--brand-primary)">
        <h2 className="text-[15rem] font-black italic">XH</h2>
      </div>
    </footer>
  );
};
