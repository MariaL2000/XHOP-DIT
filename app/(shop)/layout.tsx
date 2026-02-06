import type { Metadata } from "next";
import { Footer, Sidebar, TopMenu, InfoSection } from "@/components";

export const metadata: Metadata = {
  title: "Tienda Oficial",
  description:
    "Explora nuestra colección exclusiva de ropa urbana. Encuentra sudaderas, camisetas y accesorios con diseños únicos y calidad premium.",
  keywords: [
    "xhop dit",
    "moda xhopdit",
    "XHOP'DIT tienda",
    "XHOP'DIT",
    "xhopdit",
  ],
  openGraph: {
    title: "Catálogo Exclusivo | XHOP'DIT",
    description:
      "Lo último en tendencia urbana. Envíos rápidos y pagos seguros.",
    images: [
      {
        url: "/banners/sd.png",
        width: 1200,
        height: 630,
        alt: "XHOP'DIT Shop Banner",
      },
    ],
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col antialiased">
      <TopMenu />
      <Sidebar />

      <div className="flex-1 w-full max-w-7xl mx-auto transition-all duration-300 ease-in-out">
        <div className="px-4 md:px-10 lg:px-16">
          <div className="min-h-[50vh]">{children}</div>
        </div>
      </div>

      <div className="w-full mt-10 md:mt-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16">
          <InfoSection />
        </div>
      </div>

      <Footer />
    </main>
  );
}
